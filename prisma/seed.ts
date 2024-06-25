import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password: 'test',
      name: 'User Two',
      region: 'Ile-de-France',
      city: 'Paris',
      age: 25,
      interests: ['Board Games', 'Video Games'],
      isOrganizer: true
    }
  });

  const event1 = await prisma.event.create({
    data: {
      name: 'Board Game Night',
      location: 'Paris',
      type: 'BOARD_GAME',
      date: new Date('2024-07-01'),
      time: new Date('2024-07-01T19:00:00Z'),
      remainingSpots: 10,
      description: 'A fun night of board games!',
      isPaid: false,
      bringDrinks: true,
      bringGames: true,
      organizerId: user1.id
    }
  });

  console.log({ user1, event1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
