import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Difficulty, GridSize, PrismaClient } from '../generated/prisma/client';
import type { Item } from '../generated/prisma/client';

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error('DIRECT_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const items = [
  {
    slug: 'big-buttercup',
    name: 'Big Buttercup',
    category: 'Crop',
    rarity: 'Rare',
    imageUrl:
      'https://niyrhexxbobecyuofwgw.supabase.co/storage/v1/object/public/GardendleBucket/BigButtercup.webp',
    description: 'A rare crop item used as an early daily puzzle seed.',
    gridSize: GridSize.GRID_5X5,
  },
  {
    slug: 'dragon-fruit',
    name: 'Dragon Fruit',
    category: 'Crop',
    rarity: 'Legendary',
    imageUrl: null,
    description: 'Placeholder seed data. Replace imageUrl when the asset is ready.',
    gridSize: GridSize.GRID_5X5,
  },
  {
    slug: 'candy-blossom',
    name: 'Candy Blossom',
    category: 'Crop',
    rarity: 'Divine',
    imageUrl: null,
    description: 'Placeholder seed data. Replace imageUrl when the asset is ready.',
    gridSize: GridSize.GRID_5X5,
  },
];

async function main() {
  const seededItems: Item[] = [];

  for (const item of items) {
    const seededItem = await prisma.item.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });

    seededItems.push(seededItem);
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  await prisma.dailyPuzzle.upsert({
    where: {
      date_difficulty: {
        date: today,
        difficulty: Difficulty.EASY,
      },
    },
    update: {
      itemId: seededItems[0].id,
      revealSeed: `${today.toISOString().slice(0, 10)}:${seededItems[0].slug}`,
    },
    create: {
      date: today,
      difficulty: Difficulty.EASY,
      itemId: seededItems[0].id,
      revealSeed: `${today.toISOString().slice(0, 10)}:${seededItems[0].slug}`,
    },
  });

}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
