import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Lista maestra de platos regionales de Lambayeque
const REGIONAL_DISHES = [
  {
    name: 'Arroz con Pato',
    description:
      'Plato emblemático de Chiclayo elaborado con pato criollo macerado en chicha de jora y culantro.',
    history:
      'Tiene sus raíces en la cocina mestiza española-muchik, donde el pato criollo es el protagonista.',
  },
  {
    name: 'Espesado',
    description:
      'Sopa espesa de maíz tierno (loche) con carne de res y culantro. Plato de origen prehispánico.',
    history:
      'Se dice que este plato se consume tradicionalmente los lunes en Chiclayo.',
  },
  {
    name: 'Tortilla de Raya',
    description:
      'Tortilla a base de raya seca deshilachada, cebolla china y ají amarillo.',
    history: 'Plato popular en las picanterías del litoral lambayecano.',
  },
  {
    name: 'King Kong',
    description:
      'Alfajor gigante relleno de manjarblanco, dulce de piña y de maní.',
    history:
      'Originario de Lambayeque, su nombre fue inspirado en la película King Kong de 1933.',
  },
  {
    name: 'Cebiche a la Chiclayana',
    description:
      'Pescado fresco marinado en limón con la particularidad de servirse con tortitas de choclo y sarandaja.',
    history: 'Variedad regional del plato bandera del Perú.',
  },
  {
    name: 'Causa Ferreñafana',
    description:
      'Papa amarilla prensada servida con pescado salpreso (encebollado) y camote.',
    history: 'El plato más representativo de la provincia de Ferreñafe.',
  },
  {
    name: 'Seco de Cabrito a la Norteña',
    description:
      'Guiso de cabrito macerado en chicha de jora, servido con frijoles y arroz.',
    history: 'Plato festivo presente en todas las celebraciones de la región.',
  },
  {
    name: 'Chicha de Jora',
    description:
      'Bebida fermentada de maíz amarillo, fundamental en la gastronomía muchik.',
    history:
      'Conocida como el néctar de los incas, usada tanto para beber como para cocinar.',
  },
  {
    name: 'Manías (Patita de Cerdo)',
    description: 'Guiso de patitas de cerdo con ají y especias locales.',
    history: 'Un clásico de las picanterías tradicionales de antaño.',
  },
  {
    name: 'Chirimpico',
    description:
      'Guiso de menudencias de cabrito picadas muy finas con hierbabuena.',
    history:
      'Plato de origen colonial muy apreciado en Chiclayo por su sabor intenso.',
  },
];

async function uploadToCloudinary(
  url: string,
  publicId: string,
): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: 'muchiq/dishes',
      public_id: publicId,
      overwrite: true,
    });
    return result.secure_url;
  } catch (error) {
    console.error(
      `   [Error Cloudinary] No se pudo subir foto ${publicId}:`,
      error.message,
    );
    return null;
  }
}

async function fetchPlacePhotos(googlePlaceId: string): Promise<any[]> {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceId}&fields=photos&key=${GOOGLE_API_KEY}`,
    );
    return response.data.result.photos || [];
  } catch (error) {
    console.error(
      `   [Error Google] Error al obtener fotos del local ${googlePlaceId}:`,
      error.message,
    );
    return [];
  }
}

async function seedDishes() {
  console.log('--- Iniciando Seeding Gastronómico (Platos y Restaurantes) ---');

  // Asegurar que exista el tipo de media IMAGE
  const imageType = await prisma.mediaType.upsert({
    where: { name: 'IMAGE' },
    update: {},
    create: {
      name: 'IMAGE',
      description: 'Imágenes de alta resolución',
      extension: 'jpg',
    },
  });

  for (const dishInfo of REGIONAL_DISHES) {
    console.log(`\nProcesando Plato: ${dishInfo.name}...`);

    // 1. Crear o actualizar el Plato
    const dish = await prisma.dish.upsert({
      where: { name: dishInfo.name },
      update: {
        description: dishInfo.description,
        history: dishInfo.history,
      },
      create: {
        name: dishInfo.name,
        description: dishInfo.description,
        history: dishInfo.history,
      },
    });

    // 2. Buscar restaurantes que sirvan este plato en la región Lambayeque
    try {
      const searchRes = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          dishInfo.name + ' en Chiclayo Lambayeque',
        )}&key=${GOOGLE_API_KEY}`,
      );

      const googlePlaces = searchRes.data.results.slice(0, 5); // Tomar los top 5

      for (const gp of googlePlaces) {
        // Buscar si el local ya existe en nuestra DB por googlePlaceId
        const existingPlace = await prisma.place.findUnique({
          where: { googlePlaceId: gp.place_id },
        });

        if (existingPlace) {
          console.log(
            `   -> Vinculando a local existente: ${existingPlace.name}`,
          );

          // Crear vinculación Plato ↔ Local
          await prisma.placeDish.upsert({
            where: {
              dishId_placeId: {
                dishId: dish.id,
                placeId: existingPlace.id,
              },
            },
            update: { isSpecialty: true },
            create: {
              dishId: dish.id,
              placeId: existingPlace.id,
              isSpecialty: true,
            },
          });

          // Intentar obtener fotos reales de este plato en este local
          const photos = await fetchPlacePhotos(gp.place_id);
          const topPhotos = photos.slice(0, 2);

          for (let i = 0; i < topPhotos.length; i++) {
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${topPhotos[i].photo_reference}&key=${GOOGLE_API_KEY}`;
            const publicId = `${dish.id}_${existingPlace.id}_${i}`;

            // Subir a Cloudinary
            const cloudinaryUrl = await uploadToCloudinary(photoUrl, publicId);

            if (cloudinaryUrl) {
              await prisma.media.create({
                data: {
                  url: cloudinaryUrl,
                  mediaTypeId: imageType.id,
                  dishId: dish.id,
                  placeId: existingPlace.id,
                  caption: `${dishInfo.name} servido en ${existingPlace.name}`,
                },
              });
              console.log(
                `      [Foto] Subida foto real del plato en ${existingPlace.name}`,
              );
            }
          }
        } else {
          // Si no existe, podríamos crearlo, pero ya tenemos muchísimos locales.
          // Por ahora solo vinculamos a lo que YA tenemos para mantener calidad de datos.
          console.log(
            `   [Info] Saltando local nuevo: ${gp.name} (no está en base de datos de rutas)`,
          );
        }
      }
    } catch (err) {
      console.error(
        `   [Error] Falló búsqueda para ${dishInfo.name}:`,
        err.message,
      );
    }
  }

  console.log('\n=== SEED GASTRONÓMICO COMPLETADO ===');
}

seedDishes()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
