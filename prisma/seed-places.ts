import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno desde .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!GOOGLE_PLACES_API_KEY) {
  console.error('ERROR: GOOGLE_PLACES_API_KEY no está definido en el archivo .env');
  process.exit(1);
}

// Categorías base combinadas (originales + requeridas)
const BASE_CATEGORIES = [
  { name: 'Restaurante', icon: 'restaurant', description: 'Restaurantes y gastronomía' },
  { name: 'Museo', icon: 'museum', description: 'Museos y galerías' },
  { name: 'Sitio Arqueológico', icon: 'ruins', description: 'Ruinas y sitios arqueológicos' },
  { name: 'Reserva Natural', icon: 'tree', description: 'Reservas naturales' },
  { name: 'Monumento', icon: 'monument', description: 'Monumentos históricos' },
  { name: 'Iglesia', icon: 'church', description: 'Iglesias y catedrales' },
  { name: 'Parque', icon: 'park', description: 'Parques y centros recreativos' },
  { name: 'Playa', icon: 'beach', description: 'Playas y balnearios' },
  { name: 'Mercado', icon: 'store', description: 'Mercados locales y comercio' },
  { name: 'Alojamiento', icon: 'hotel', description: 'Hoteles y hospedajes' },
  { name: 'Plaza', icon: 'square', description: 'Plazas principales' },
];

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

  if (typesStr.includes('restaurant') || typesStr.includes('food')) matchedCategoryName = 'Restaurante';
  else if (typesStr.includes('museum')) matchedCategoryName = 'Museo';
  else if (typesStr.includes('ruin') || typesStr.includes('archaeological')) matchedCategoryName = 'Sitio Arqueológico';
  else if (typesStr.includes('church') || typesStr.includes('place_of_worship')) matchedCategoryName = 'Iglesia';
  else if (typesStr.includes('monument')) matchedCategoryName = 'Monumento';
  else if (typesStr.includes('park') || typesStr.includes('reserve')) matchedCategoryName = 'Parque';
  else if (typesStr.includes('beach')) matchedCategoryName = 'Playa';
  else if (typesStr.includes('natural_feature')) matchedCategoryName = 'Reserva Natural';
  else if (typesStr.includes('market') || typesStr.includes('store')) matchedCategoryName = 'Mercado';
  else if (typesStr.includes('lodging') || typesStr.includes('hotel')) matchedCategoryName = 'Alojamiento';

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
      console.warn(`Aviso de Google API (${query}): ${response.data.status} - ${response.data.error_message || ''}`);
      return [];
    }
    return response.data.results;
  } catch (error: any) {
    console.error(`Error consultando Google Places API para '${query}':`, error.message);
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
      console.error(`Error obteniendo detalles del lugar ${placeId}:`, error.message);
      return null;
    }
}

async function seedPlaces() {
  const dbCategories = await seedCategories();
  
  // Búsquedas orientadas a Lambayeque, Perú con todas las categorías combinadas
  const searchQueries = [
    'Principales atracciones turisticas en Lambayeque, Peru',
    'Restaurantes en Lambayeque, Peru',
    'Museos en Lambayeque, Peru',
    'Sitios arqueologicos en Lambayeque, Peru',
    'Iglesias y monumentos en Lambayeque, Peru',
    'Parques en Lambayeque, Peru',
    'Playas en Lambayeque, Peru',
    'Mercados en Lambayeque, Peru',
    'Alojamientos en Lambayeque, Peru'
  ];

  console.log('\n--- Buscando Lugares en Lambayeque (Google Places API) ---');
  
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
  
  console.log(`\nEncontrados ${uniquePlaces.length} lugares únicos. Obteniendo detalles y guardando en BD...`);

  let count = 0;
  for (const googlePlace of uniquePlaces) {
    // Para no exceder límites de API rate si hay muchos, un pequeño sleep si fuera necesario, pero lo dejamos iterando normal.
    const details = await fetchPlaceDetails(googlePlace.place_id);
    
    if (!details) continue;

    const name = details.name;
    const address = details.formatted_address || googlePlace.formatted_address || "Lambayeque, Peru";
    const lat = details.geometry?.location?.lat || googlePlace.geometry?.location?.lat;
    const lng = details.geometry?.location?.lng || googlePlace.geometry?.location?.lng;
    const description = details.editorial_summary?.overview || googlePlace.name;
    
    // Extraer distrito/ciudad
    let district = 'Lambayeque';
    let city = 'Lambayeque';

    if (details.address_components) {
        const dComp = details.address_components.find((c: any) => c.types.includes('locality') || c.types.includes('sublocality'));
        if (dComp) district = dComp.long_name;
        
        const cComp = details.address_components.find((c: any) => c.types.includes('administrative_area_level_2'));
        if (cComp) city = cComp.long_name;
    }


    const metadata = {
        google_place_id: googlePlace.place_id,
        rating: details.rating || googlePlace.rating,
        phone: details.formatted_phone_number,
        photo_references: details.photos ? details.photos.map((p: any) => p.photo_reference).slice(0, 3) : [],
        types: details.types || googlePlace.types || []
    };

    // Crear o actualizar en la BD
    try {
        const savedPlace = await prisma.place.create({
            data: {
                name,
                description,
                address,
                district,
                city,
                country: 'PE',
                latitude: lat,
                longitude: lng,
                metadata: metadata,
            }
        });

        // Vincular Categoría
        const categoryIdToLink = mapGoogleTypeToCategory(metadata.types, dbCategories);
        await prisma.placeCategory.create({
            data: {
                placeId: savedPlace.id,
                categoryId: categoryIdToLink
            }
        });

        count++;
        console.log(`[+] Creado: ${name} (ID: ${savedPlace.id})`);
    } catch (e: any) {
         if (e.code === 'P2002') {
             console.log(`[-] Omitiendo (Ya existe): ${name}`);
         } else {
             console.error(`[!] Error guardando ${name}:`, e.message);
         }
    }
  }

  console.log(`\n=== SEED COMPLETADO ===`);
  console.log(`Lugares nuevos creados: ${count}`);
}

seedPlaces()
  .catch((e: any) => {
    console.error('Error general en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
