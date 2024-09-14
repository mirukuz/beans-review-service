import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Helper function to create random users
  const createRandomUser = () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    joinedSince: faker.date.past(),
    avatar: faker.image.avatar(),
  });

  // Create 3 random users
  const users = await Promise.all(
    Array.from({ length: 3 }).map(async () => {
      const userData = createRandomUser();
      return prisma.user.create({ data: userData });
    })
  );

  // Create 3 random roasters
  const roasters = await Promise.all(
    Array.from({ length: 3 }).map(() => {
      const roasterData: Prisma.RoasterCreateInput = {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        description: faker.lorem.paragraph(),
        country: faker.location.country(),
        website: faker.internet.url(),
        photo: faker.image.url(),
      };
      return prisma.roaster.create({ data: roasterData });
    })
  );

  // Create beans for each user and roaster, and then create reviews
  for (const user of users) {
    for (const roaster of roasters) {
      const beanData: Prisma.BeanCreateInput = {
        name: faker.lorem.word(),
        origin: faker.helpers.arrayElement(['Brazil', 'CostaRica', 'Rwanda', 'ElSalvador', 'Peru']),
        photo: faker.image.url(),
        process: faker.helpers.arrayElement(['Washed', 'Natural', 'Honey', 'Special', 'Other']),
        description: faker.lorem.sentence(),
        tastingNote: faker.helpers.arrayElement(['Floral', 'Fruity', 'Cocoa', 'Sweetness', 'Sour', 'Baking', 'Spice', 'Green', 'Other']),
        roaster: {
          connect: {
            id: roaster.id,
          },
        },
        user: {
          connect: {
            email: user.email,
          },
        },
      };

      // Create the bean
      const createdBean = await prisma.bean.create({ data: beanData });

      // Create a review for the bean
      const reviewData: Prisma.ReviewCreateInput = {
        content: faker.lorem.paragraph(),
        published: true,
        rating: faker.number.int({ min: 1, max: 5 }),
        photo: faker.image.url(),
        bean: {
          connect: {
            id: createdBean.id,
          },
        },
        author: {
          connect: {
            email: user.email,
          },
        },
      };

      await prisma.review.create({ data: reviewData });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });