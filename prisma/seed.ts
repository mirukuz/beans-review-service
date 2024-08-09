import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@example.com",
    joinedSince: new Date("2021-05-01"),
    avatar: "https://example.com/avatars/alice.png",
    reviews: {
      create: [
        {
          content: "Amazing coffee with floral notes!",
          published: true,
          Rating: 5,
          photo: "https://example.com/reviews/alice_review1.png",
          bean: {
            create: {
              name: "Yes",
              produceAt: new Date("2021-08-10"),
              origin: "Ethiopia",
              process: "Washed",
              description: "A washed coffee with floral and fruity notes.",
              roaster: {
                create: {
                  name: "Ethiopian Roaster Co.",
                  address: "123 Coffee Street, Addis Ababa",
                  country: "Ethiopia",
                  website: "https://ethiopianroaster.example.com",
                  photo: "https://example.com/roasters/ethiopian_roaster.png",
                },
              },
              tastingNote: "Floral",
            },
          },
        },
      ],
    },
  },
  {
    name: "Bob",
    email: "bob@example.com",
    joinedSince: new Date("2020-09-15"),
    avatar: "https://example.com/avatars/bob.png",
    reviews: {
      create: [
        {
          content: "Rich cocoa flavor, highly recommend.",
          published: true,
          Rating: 4,
          photo: "https://example.com/reviews/bob_review1.png",
          bean: {
            create: {
              name: "Benny",
              produceAt: new Date("2021-05-05"),
              origin: "Colombia",
              process: "Natural",
              description: "A natural coffee with rich cocoa and spice notes.",
              roaster: {
                create: {
                  name: "Colombian Delights",
                  address: "456 Coffee Avenue, Bogotá",
                  country: "Colombia",
                  website: "https://colombiandelights.example.com",
                  photo: "https://example.com/roasters/colombian_delights.png",
                },
              },
              tastingNote: "Cocoa",
            },
          },
        },
      ],
    },
  },
  {
    name: "Charlie",
    email: "charlie@example.com",
    joinedSince: new Date("2019-11-20"),
    avatar: "https://example.com/avatars/charlie.png",
    reviews: {
      create: [
        {
          content: "Unique honey-processed coffee with a hint of fruit.",
          published: true,
          Rating: 5,
          photo: "https://example.com/reviews/charlie_review1.png",
          bean: {
            create: {
              name: "Floozy",
              produceAt: new Date("2021-10-20"),
              origin: "Kenya",
              process: "Honey",
              description: "A honey processed coffee with fruity and sweet notes.",
              roaster: {
                create: {
                  name: "Kenyan Coffees",
                  address: "789 Coffee Blvd, Nairobi",
                  country: "Kenya",
                  website: "https://kenyancoffees.example.com",
                  photo: "https://example.com/roasters/kenyan_coffees.png",
                },
              },
              tastingNote: "Fruity",
            },
          },
        },
        {
          content: "Loved the sweetness in this coffee.",
          published: true,
          Rating: 4,
          photo: "https://example.com/reviews/charlie_review2.png",
          bean: {
            create: {
              name: "Ale Craft",
              produceAt: new Date("2021-11-15"),
              origin: "Brazil",
              process: "Natural",
              description: "A naturally processed coffee with prominent sweetness.",
              roaster: {
                create: {
                  name: "Brazilian Beans",
                  address: "101 Coffee Road, São Paulo",
                  country: "Brazil",
                  website: "https://brazilianbeans.example.com",
                  photo: "https://example.com/roasters/brazilian_beans.png",
                },
              },
              tastingNote: "Sweetness",
            },
          },
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
