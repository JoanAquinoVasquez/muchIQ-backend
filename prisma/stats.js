const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const placeCount = await prisma.place.count();
    const dishCount = await prisma.dish.count();
    const placeDishCount = await prisma.placeDish.count();
    const mediaCount = await prisma.media.count();

    console.log('--- Final Statistics ---');
    console.log('Total Places (Restaurantes/Lugares):', placeCount);
    console.log('Total Regional Dishes:', dishCount);
    console.log('Total Place-Dish Links:', placeDishCount);
    console.log('Total Media Records (Photos):', mediaCount);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
