import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Cargar variables de entorno desde .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!GOOGLE_PLACES_API_KEY) {
  console.error(
    'ERROR: GOOGLE_PLACES_API_KEY no está definido en el archivo .env',
  );
  process.exit(1);
}

// Categorías base combinadas (originales + requeridas)
const BASE_CATEGORIES = [
  {
    name: 'Restaurante',
    icon: 'restaurant',
    description: 'Restaurantes y gastronomía',
  },
  { name: 'Museo', icon: 'museum', description: 'Museos y galerías' },
  {
    name: 'Sitio Arqueológico',
    icon: 'ruins',
    description: 'Ruinas y sitios arqueológicos',
  },
  { name: 'Reserva Natural', icon: 'tree', description: 'Reservas naturales' },
  { name: 'Monumento', icon: 'monument', description: 'Monumentos históricos' },
  { name: 'Iglesia', icon: 'church', description: 'Iglesias y catedrales' },
  {
    name: 'Parque',
    icon: 'park',
    description: 'Parques y centros recreativos',
  },
  { name: 'Playa', icon: 'beach', description: 'Playas y balnearios' },
  {
    name: 'Mercado',
    icon: 'store',
    description: 'Mercados locales y comercio',
  },
  { name: 'Alojamiento', icon: 'hotel', description: 'Hoteles y hospedajes' },
  { name: 'Plaza', icon: 'square', description: 'Plazas principales' },
];

async function seedMediaTypes() {
  console.log('--- Creando Tipos de Media ---');
  return await prisma.mediaType.upsert({
    where: { name: 'IMAGE' },
    update: {},
    create: {
      name: 'IMAGE',
      description: 'Imágenes cargadas desde Google Places',
      extension: 'jpg',
    },
  });
}

async function seedCategories() {
  console.log('--- Creando Categorías Base ---');
  const categories = [];
  for (const cat of BASE_CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        icon: cat.icon,
        description: cat.description,
      },
    });
    categories.push(category);
    console.log(`Categoría lista: ${category.name}`);
  }
  return categories;
}

// Mapea el tipo devuelto por Google a nuestras categorías
function mapGoogleTypeToCategory(types: string[], categories: any[]): string {
  if (!types || types.length === 0) return categories[0].id; // Fallback

  const typesStr = types.join(' ').toLowerCase();

  let matchedCategoryName = 'Plaza'; // Default

  if (typesStr.includes('restaurant') || typesStr.includes('food'))
    matchedCategoryName = 'Restaurante';
  else if (typesStr.includes('museum')) matchedCategoryName = 'Museo';
  else if (typesStr.includes('ruin') || typesStr.includes('archaeological'))
    matchedCategoryName = 'Sitio Arqueológico';
  else if (typesStr.includes('church') || typesStr.includes('place_of_worship'))
    matchedCategoryName = 'Iglesia';
  else if (typesStr.includes('monument')) matchedCategoryName = 'Monumento';
  else if (typesStr.includes('park') || typesStr.includes('reserve'))
    matchedCategoryName = 'Parque';
  else if (typesStr.includes('beach')) matchedCategoryName = 'Playa';
  else if (typesStr.includes('natural_feature'))
    matchedCategoryName = 'Reserva Natural';
  else if (typesStr.includes('market') || typesStr.includes('store'))
    matchedCategoryName = 'Mercado';
  else if (typesStr.includes('lodging') || typesStr.includes('hotel'))
    matchedCategoryName = 'Alojamiento';

  const category = categories.find((c) => c.name === matchedCategoryName);
  return category ? category.id : categories[0].id;
}

async function fetchPlacesFromGoogle(query: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query,
    )}&key=${GOOGLE_PLACES_API_KEY}&language=es`;
    const response = await axios.get(url);

    if (response.data.status !== 'OK') {
      console.warn(
        `Aviso de Google API (${query}): ${response.data.status} - ${response.data.error_message || ''}`,
      );
      return [];
    }
    return response.data.results;
  } catch (error: any) {
    console.error(
      `Error consultando Google Places API para '${query}':`,
      error.message,
    );
    return [];
  }
}

async function fetchPlaceDetails(placeId: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,geometry,formatted_address,address_components,types,photos,editorial_summary&key=${GOOGLE_PLACES_API_KEY}&language=es`;
    const response = await axios.get(url);
    if (response.data.status !== 'OK') return null;
    return response.data.result;
  } catch (error: any) {
    console.error(
      `Error obteniendo detalles del lugar ${placeId}:`,
      error.message,
    );
    return null;
  }
}

async function uploadPhotoToCloudinary(
  photoReference: string,
  googlePlaceId: string,
) {
  try {
    const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;

    // Cloudinary permite subir directamente desde una URL
    const uploadResponse = await cloudinary.uploader.upload(googlePhotoUrl, {
      folder: `muchiq/places/${googlePlaceId}`,
      resource_type: 'image',
    });

    return uploadResponse.secure_url;
  } catch (error: any) {
    console.error(`Error subiendo foto a Cloudinary:`, error.message);
    return null;
  }
}

async function seedPlaces() {
  const dbCategories = await seedCategories();
  const imageMediaType = await seedMediaTypes();

  // Búsquedas orientadas exclusivamente a TURISMO en Chiclayo y alrededores
  const searchQueries = [
    'Mejores restaurantes turisticos y picanterias en Chiclayo',
    'Atractivos turisticos culturales en Chiclayo centro',
    'Artesanias y cultura en Monsefu Chiclayo',
    'Sitios historicos y plazuelas turisticas en Chiclayo',
    'Turismo de naturaleza y playas en Pimentel y Santa Rosa',
    'Museos y centros culturales en la provincia de Chiclayo',
    'Mercado Modelo de Chiclayo seccion de hierbas y artesanias',
    'Lugares de paseo y recreacion turistica en la Victoria Chiclayo',
    'Artesania en Ciudad Eten Lambayeque',
  ];

  console.log(
    '\n--- Buscando MÁS Lugares de INTERÉS TURÍSTICO en Chiclayo (Google Places API) ---',
  );

  const allPlaces = [];
  // Recopilar resultados de todas las búsquedas
  for (const query of searchQueries) {
    console.log(`Buscando: "${query}"...`);
    const results = await fetchPlacesFromGoogle(query);
    allPlaces.push(...results);
  }

  // Eliminar duplicados basados en place_id de Google
  const uniquePlacesMap = new Map();
  for (const place of allPlaces) {
    if (!uniquePlacesMap.has(place.place_id)) {
      uniquePlacesMap.set(place.place_id, place);
    }
  }
  const uniquePlaces = Array.from(uniquePlacesMap.values());

  console.log(
    `\nEncontrados ${uniquePlaces.length} lugares únicos. Obteniendo detalles y guardando en BD...`,
  );

  let count = 0;
  for (const googlePlace of uniquePlaces) {
    const details = await fetchPlaceDetails(googlePlace.place_id);

    if (!details) continue;

    const name = details.name;
    const address =
      details.formatted_address ||
      googlePlace.formatted_address ||
      'Lambayeque, Peru';
    const lat =
      details.geometry?.location?.lat || googlePlace.geometry?.location?.lat;
    const lng =
      details.geometry?.location?.lng || googlePlace.geometry?.location?.lng;
    const description = details.editorial_summary?.overview || googlePlace.name;

    // Extraer distrito/ciudad
    let district = 'Lambayeque';
    let city = 'Lambayeque';

    if (details.address_components) {
      const dComp = details.address_components.find(
        (c: any) =>
          c.types.includes('locality') || c.types.includes('sublocality'),
      );
      if (dComp) district = dComp.long_name;

      const cComp = details.address_components.find((c: any) =>
        c.types.includes('administrative_area_level_2'),
      );
      if (cComp) city = cComp.long_name;
    }

    const photoReferences = details.photos
      ? details.photos.map((p: any) => p.photo_reference).slice(0, 3)
      : [];

    const metadata = {
      google_place_id: googlePlace.place_id,
      rating: details.rating || googlePlace.rating,
      phone: details.formatted_phone_number,
      photo_references: photoReferences,
      types: details.types || googlePlace.types || [],
    };

    // Crear o actualizar en la BD
    try {
      const savedPlace = await prisma.place.upsert({
        where: { googlePlaceId: googlePlace.place_id },
        create: {
          googlePlaceId: googlePlace.place_id,
          name,
          description,
          address,
          district,
          city,
          country: 'PE',
          latitude: lat,
          longitude: lng,
          metadata: metadata,
        },
        update: {
          metadata: metadata,
        },
      });

      // Vincular Categoría
      const categoryIdToLink = mapGoogleTypeToCategory(
        metadata.types,
        dbCategories,
      );
      await prisma.placeCategory.upsert({
        where: {
          placeId_categoryId: {
            placeId: savedPlace.id,
            categoryId: categoryIdToLink,
          },
        },
        update: {},
        create: {
          placeId: savedPlace.id,
          categoryId: categoryIdToLink,
        },
      });

      // Verificar si ya tiene media para evitar duplicados en cada ejecución
      const existingMedia = await prisma.media.findFirst({
        where: { placeId: savedPlace.id },
      });

      if (!existingMedia && photoReferences.length > 0) {
        console.log(
          `   -> Subiendo ${photoReferences.length} fotos para ${name}...`,
        );
        for (const ref of photoReferences) {
          const cloudinaryUrl = await uploadPhotoToCloudinary(
            ref,
            googlePlace.place_id,
          );
          if (cloudinaryUrl) {
            await prisma.media.create({
              data: {
                url: cloudinaryUrl,
                mediaTypeId: imageMediaType.id,
                placeId: savedPlace.id,
                caption: `Foto de ${name}`,
              },
            });
          }
        }
      }

      count++;
      console.log(`[+] Procesado: ${name} (ID: ${savedPlace.id})`);
    } catch (e: any) {
      console.error(`[!] Error procesando ${name}:`, e.message);
    }
  }

  console.log(`\n=== SEED COMPLETADO ===`);
  console.log(`Lugares procesados: ${count}`);
}

seedPlaces()
  .catch((e: any) => {
    console.error('Error general en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
