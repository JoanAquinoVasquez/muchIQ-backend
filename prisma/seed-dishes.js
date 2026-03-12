const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

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

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Lista maestra de platos regionales de Lambayeque (30 platos)
const REGIONAL_DISHES = [
    {
        name: 'Arroz con Pato',
        description: 'Plato emblemático de Chiclayo elaborado con pato criollo macerado en chicha de jora y culantro.',
        history: 'Tiene sus raíces en la cocina mestiza española-muchik, donde el pato criollo es el protagonista.',
    },
    {
        name: 'Espesado',
        description: 'Sopa espesa de maíz tierno (loche) con carne de res y culantro. Plato de origen prehispánico.',
        history: 'Se dice que este plato se consume tradicionalmente los lunes en Chiclayo.',
    },
    {
        name: 'Tortilla de Raya',
        description: 'Tortilla a base de raya seca deshilachada, cebolla china y ají amarillo.',
        history: 'Plato popular en las picanterías del litoral lambayecano.',
    },
    {
        name: 'King Kong',
        description: 'Alfajor gigante relleno de manjarblanco, dulce de piña y de maní.',
        history: 'Originario de Lambayeque, su nombre fue inspirado en la película King Kong de 1933.',
    },
    {
        name: 'Cebiche a la Chiclayana',
        description: 'Pescado fresco marinado en limón con la particularidad de servirse con tortitas de choclo y sarandaja.',
        history: 'Variedad regional del plato bandera del Perú.',
    },
    {
        name: 'Causa Ferreñafana',
        description: 'Papa amarilla prensada servida con pescado salpreso (encebollado) y camote.',
        history: 'El plato más representativo de la provincia de Ferreñafe.',
    },
    {
        name: 'Seco de Cabrito a la Norteña',
        description: 'Guiso de cabrito macerado en chicha de jora, servido con frijoles y arroz.',
        history: 'Plato festivo presente en todas las celebraciones de la región.',
    },
    {
        name: 'Chicha de Jora',
        description: 'Bebida fermentada de maíz amarillo, fundamental en la gastronomía muchik.',
        history: 'Conocida como el néctar de los incas, usada tanto para beber como para cocinar.',
    },
    {
        name: 'Manías (Patita de Cerdo)',
        description: 'Guiso de patitas de cerdo con ají y especias locales.',
        history: 'Un clásico de las picanterías tradicionales de antaño.',
    },
    {
        name: 'Chirimpico',
        description: 'Guiso de menudencias de cabrito picadas muy finas con hierbabuena.',
        history: 'Plato de origen colonial muy apreciado en Chiclayo por su sabor intenso.',
    },
    {
        name: 'Chinguirito',
        description: 'Plato a base de pescado guitarra seco y deshilachado, cebolla, limón y ají.',
        history: 'Especialidad única de la costa de Lambayeque, especialmente en Pimentel y Santa Rosa.',
    },
    {
        name: 'Sudado de Pescado a la Norteña',
        description: 'Pescado fresco cocido al vapor con tomate, cebolla, chicha de jora y culantro.',
        history: 'Plato tradicional de los pescadores de las caletas de Lambayeque.',
    },
    {
        name: 'Frito Chiclayano',
        description: 'Cerdo frito sazonado con especias locales, servido con camote sancochado y yuca.',
        history: 'Un desayuno clásico y contundente en los mercados de Chiclayo.',
    },
    {
        name: 'Humitas Chiclayanas',
        description: 'Masa de maíz tierno rellena de carne o dulce, envuelta en pancas de choclo.',
        history: 'Herederas de la tradición andina, con el toque sazonado del norte.',
    },
    {
        name: 'Boda (Plato de Fiesta)',
        description: 'Guiso tradicional de bodas con carne de pavo, arroz y garbanzos.',
        history: 'Plato central en los banquetes de las zonas rurales de Lambayeque.',
    },
    {
        name: 'Pepián de Pava',
        description: 'Guiso espeso de maíz molido con carne de pavo, típico de la zona de Ferreñafe.',
        history: 'Plato ancestral que destaca la importancia del pavo en la dieta Lambayecana.',
    },
    {
        name: 'Panquita de Life',
        description: 'Pescado de río (life) sazonado y envuelto en pancas de maíz cocido a la brasa.',
        history: 'Especialidad de Monsefú, rescatando técnicas de cocción prehispánicas.',
    },
    {
        name: 'Tortitas de Choclo',
        description: 'Pequeñas masas fritas de maíz tierno rallado, crocantes y dulces.',
        history: 'Acompañamiento indispensable del cebiche chiclayano.',
    },
    {
        name: 'Arroz con Mariscos',
        description: 'Arroz sazonado con ajíes y una gran variedad de mariscos frescos.',
        history: 'Popular en los balnearios de Pimentel y Eten.',
    },
    {
        name: 'Ceviche de Conchas Negras',
        description: 'Plato de sabor intenso a base de conchas de los manglares, limón y ají moche.',
        history: 'Manjar afrodisíaco muy buscado en el norte del Perú.',
    },
    {
        name: 'Chilcano de Pescado',
        description: 'Sopa clara y concentrada hecha con cabezas de pescado, limón y culantro.',
        history: 'El mejor aliado para recuperar energías tras una noche de fiesta.',
    },
    {
        name: 'Jalea Norteña',
        description: 'Mezcla de trozos de pescado y mariscos fritos, servidos con yuca frita y zarza.',
        history: 'Plato generoso para compartir en las picanterías.',
    },
    {
        name: 'Majaris',
        description: 'Guiso regional de plátano verde machacado con carne o mariscos.',
        history: 'Influencia de la cocina costera del norte peruano.',
    },
    {
        name: 'Dulce de Membrillo',
        description: 'Postre artesanal elaborado con membrillo fresco de la región.',
        history: 'Dulce tradicional que aún se prepara en ollas de barro en Lambayeque.',
    },
    {
        name: 'Champús',
        description: 'Bebida caliente y espesa a base de maíz machacado, frutas y especias.',
        history: 'Bebida nocturna clásica en las esquinas de la ciudad de Chiclayo.',
    },
    {
        name: 'Picante de Cuy',
        description: 'Carne de cuy frita con una salsa picante de ají panca y maní.',
        history: 'Plato que conecta la costa con las tradiciones de la sierra lambayecana.',
    },
    {
        name: 'Cabrito al Horno',
        description: 'Variante del seco de cabrito, asado lentamente con especias del norte.',
        history: 'Plato dominical preferido por las familias Lambayecanas.',
    },
    {
        name: 'Arroz Aguaradito de Pato',
        description: 'Sopa espesa de arroz con trozos de pato, harto culantro y verduras.',
        history: 'El "levanta muertos" por excelencia de las picanterías chiclayanas.',
    },
    {
        name: 'Parihuela Chiclayana',
        description: 'Sopa poderosa de diversos pescados y mariscos con un toque de chicha.',
        history: 'Concentrado marino emblemático de las caletas norteñas.',
    },
    {
        name: 'Alfajores de Lambayeque',
        description: 'Pequeños dulces de masa fina rellenos de manjarblanco artesanal.',
        history: 'Icono del dulce Lambayecano junto al King Kong.',
    }
];

async function uploadToCloudinary(url, publicId) {
    try {
        const result = await cloudinary.uploader.upload(url, {
            folder: 'muchiq/dishes',
            public_id: publicId,
            overwrite: true,
        });
        return result.secure_url;
    } catch (error) {
        console.error(`   [Error Cloudinary] No se pudo subir foto ${publicId}:`, error.message);
        return null;
    }
}

async function fetchPlacePhotos(googlePlaceId) {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceId}&fields=photos&key=${GOOGLE_API_KEY}`
        );
        return response.data.result.photos || [];
    } catch (error) {
        console.error(`   [Error Google] Error al obtener fotos del local ${googlePlaceId}:`, error.message);
        return [];
    }
}

async function seedDishes() {
    console.log('--- Iniciando Seeding Gastronómico Masivo (30 platos) ---');

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
                    dishInfo.name + ' en Chiclayo Lambayeque'
                )}&key=${GOOGLE_API_KEY}`
            );

            const googlePlaces = searchRes.data.results.slice(0, 5); // Tomar los top 5

            for (const gp of googlePlaces) {
                // Buscar si el local ya existe en nuestra DB por googlePlaceId
                const existingPlace = await prisma.place.findUnique({
                    where: { googlePlaceId: gp.place_id },
                });

                if (existingPlace) {
                    console.log(`   -> Vinculando a local existente: ${existingPlace.name}`);

                    // Crear vinculación Plato ↔ Local
                    await prisma.placeDish.upsert({
                        where: {
                            dishId_placeId: {
                                dishId: dish.id,
                                placeId: existingPlace.id
                            }
                        },
                        update: { isSpecialty: true },
                        create: {
                            dishId: dish.id,
                            placeId: existingPlace.id,
                            isSpecialty: true
                        }
                    });

                    // Intentar obtener fotos reales de este plato en este local
                    const photos = await fetchPlacePhotos(gp.place_id);
                    const topPhotos = photos.slice(0, 1); // Tomar solo 1 para esta expansión masiva y ahorrar API/Tiempo

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
                                    caption: `${dishInfo.name} servido en ${existingPlace.name}`
                                }
                            });
                            console.log(`      [Foto] Subida foto real del plato en ${existingPlace.name}`);
                        }
                    }
                }
            }
        } catch (err) {
            console.error(`   [Error] Falló búsqueda para ${dishInfo.name}:`, err.message);
        }
    }

    console.log('\n=== SEED GASTRONÓMICO MASIVO COMPLETADO ===');
}

seedDishes()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
