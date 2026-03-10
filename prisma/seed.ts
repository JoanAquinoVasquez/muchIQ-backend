import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🌱 Full Seeding database...');

  // 1. Permissions Actions
  const actions = ['view', 'create', 'edit', 'delete'];
  for (const action of actions) {
    await prisma.permissionAction.upsert({
      where: { name: action.toUpperCase() },
      update: {},
      create: { 
        name: action.toUpperCase(), 
        code: action 
      }
    });
  }

  // 2. Roles
  const roles = [
    { name: 'ADMIN', color: '#F44336' },
    { name: 'PARTNER', color: '#2196F3' },
    { name: 'EXPLORER', color: '#4CAF50' },
  ];
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    });
  }

  // 3. Media Types
  const mediaTypes = ['IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO'];
  for (const type of mediaTypes) {
    await prisma.mediaType.upsert({
      where: { name: type },
      update: {},
      create: { name: type }
    });
  }

  // 4. Notification Types
  const notifTypes = ['SYSTEM', 'REWARD', 'LEVEL_UP', 'SOCIAL'];
  for (const type of notifTypes) {
    await prisma.notificationType.upsert({
      where: { name: type },
      update: {},
      create: { name: type }
    });
  }

  // 5. Categories
  const categories = [
    { name: 'General', icon: 'explore' },
    { name: 'Gastronomía', icon: 'restaurant' },
    { name: 'Cultura', icon: 'museum' },
    { name: 'Naturaleza', icon: 'nature' },
    { name: 'Aventura', icon: 'directions_run' },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    });
  }

  // 6. Difficulty Levels
  const difficulties = [
    { name: 'EASY', color: '#4CAF50', order: 1 },
    { name: 'MEDIUM', color: '#FF9800', order: 2 },
    { name: 'HARD', color: '#F44336', order: 3 },
  ];
  for (const diff of difficulties) {
    await prisma.difficultyLevel.upsert({
      where: { name: diff.name },
      update: {},
      create: diff
    });
  }

  console.log('✅ Full Seeding complete.');
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
