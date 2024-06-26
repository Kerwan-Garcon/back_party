import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'user3@example.com',
      password: 'test',
      name: 'User Two',
      age: 25,
      interests: ['Board Games', 'Video Games'],
      isOrganizer: true,
      location: {
        create: {
          address: '123 Main St',
          city: 'Paris',
          region: 'Ile-de-France',
          country: 'France',
          zipCode: '75001'
        }
      },
      events: {
        create: {
          name: 'Board Game Night',
          type: 'BOARD_GAME',
          date: new Date('2024-07-01'),
          time: new Date('2024-07-01T19:00:00Z'),
          remainingSpots: 10,
          description: 'A fun night of board games!',
          isPaid: false,
          bringDrinks: true,
          bringGames: true,
          location: {
            create: {
              address: '456 Elm St',
              city: 'Paris',
              region: 'Ile-de-France',
              country: 'France',
              zipCode: '75002'
            }
          }
        }
      }
    },
    include: {
      location: true,
      events: true
    }
  });

  console.log({ user1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
