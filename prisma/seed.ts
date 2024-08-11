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
                  description: "Nestled in the heart of the Rockies, Mountain Peak Roasters specializes in crafting premium, high-altitude coffees that capture the crispness of mountain air and the richness of fertile soils. Sourcing beans from the world's finest coffee-growing regions, each batch is meticulously roasted to bring out flavors that range from velvety chocolate undertones to bright, citrus notes. Mountain Peak Roasters offers an escape to the serene wilderness with every sip, making it the perfect companion for your next adventure or a cozy morning at home.",
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
                  description: "Colombian Delights takes pride in its direct connection to the lush, mountainous coffee regions of Colombia. With roots deeply embedded in local culture and agriculture, this roaster is dedicated to bringing the authentic taste of Colombian coffee to enthusiasts worldwide. Known for their attention to detail and commitment to ethical practices, Colombian Delights ensures every cup offers a harmonious blend of rich, fruity undertones with a smooth, chocolatey finish. Experience the heart of Colombia in each aromatic cup, perfect for those who appreciate the genuine flavors of this coffee paradise.",
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
                  description: "Kenyan Coffees is renowned for its dedication to sourcing the finest beans from the high-altitude regions of Kenya, where the unique climate and fertile soil contribute to some of the world's most sought-after coffee profiles. This roastery is committed to quality and sustainability, ensuring that each batch is a true reflection of Kenya’s distinctive taste profile. Expect lively acidity, bright citrus notes, and complex flavors that dance on your palate. Kenyan Coffees offers a luxurious coffee experience that celebrates the vibrant landscapes and rich heritage of Kenya.",
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
              description: "",
              roaster: {
                create: {
                  name: "Brazilian Beans",
                  address: "101 Coffee Road, São Paulo",
                  description: "Brazilian Beans roastery harnesses the immense coffee heritage of Brazil, the world's largest coffee producer. Located in the bustling city of São Paulo, this roastery sources beans from Brazil's famed coffee-growing regions, ensuring each roast is a true representation of Brazilian excellence. Brazilian Beans focuses on full-bodied coffees with nutty, sweet, and chocolatey characteristics that are perfect for any coffee lover. Each cup promises consistency, depth, and a touch of Brazilian warmth, making it a staple for both casual drinkers and coffee aficionados.",
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
