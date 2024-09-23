import { builder } from '../builder'
import { prisma } from '../db'

// Define enums
const Process = builder.enumType('Process', {
  values: ['Washed', 'Natural', 'Honey', 'Special', 'Other'],
})

const TastingNote = builder.enumType('TastingNote', {
  values: [
    'Fruity',
    'Cocoa',
    'Sweetness',
    'Floral',
    'Sour',
    'Baking',
    'Spice',
    'Green',
    'Other',
  ],
})

const Origin = builder.enumType('Origin', {
  values: [
    'Brazil',
    'Colombia',
    'Ethiopia',
    'Kenya',
    'Guatemala',
    'Honduras',
    'CostaRica',
    'Indonesia',
    'Vietnam',
    'Mexico',
    'Peru',
    'Nicaragua',
    'Tanzania',
    'Rwanda',
    'Uganda',
    'India',
    'Yemen',
    'Panama',
    'ElSalvador',
    'PapuaNewGuinea',
    'Other'
  ],
})

builder.prismaObject('Bean', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name'),
    roaster: t.relation('roaster'),
    reviews: t.relation('reviews'),
    description: t.exposeString('description'),
    image: t.exposeString('image'),
    published: t.exposeBoolean('published'),
    tastingNotes: t.expose('tastingNotes', { type: [TastingNote] }),
    process: t.expose('process', { type: Process }),
    website: t.exposeString('website'),
    origin: t.exposeString('origin'),
    submitterId: t.exposeString('submitterId')
  }),
})

builder.queryFields((t) => ({
  beanById: t.prismaField({
    type: 'Bean',
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: (query, parent, args) =>
      prisma.bean.findUnique({
        ...query,
        where: { id: args.id },
      }),
  }),
  allBeans: t.prismaField({
    type: ['Bean'],
    args: {
      searchString: t.arg.string(),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: (query, parent, args) => {
      const or = args.searchString
        ? {
            OR: [
              { title: { contains: args.searchString } },
              { content: { contains: args.searchString } },
            ],
          }
        : {}

      return prisma.bean.findMany({
        ...query,
        take: args.take ?? undefined,
        skip: args.skip ?? undefined,
      })
    },
  }),
  allUnpublishedBeans: t.prismaField({
    type: ['Bean'],
    args: {
      searchString: t.arg.string(),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: (query, parent, args) => {
      const or = args.searchString
        ? {
            OR: [
              { title: { contains: args.searchString } },
              { content: { contains: args.searchString } },
            ],
          }
        : {}

      return prisma.bean.findMany({
        ...query,
        where: {
          published: false,
        },
        take: args.take ?? undefined,
        skip: args.skip ?? undefined,
      })
    },
  }),
  allPublishedBeans: t.prismaField({
    type: ['Bean'],
    args: {
      searchString: t.arg.string(),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: (query, parent, args) => {
      const or = args.searchString
        ? {
            OR: [
              { title: { contains: args.searchString } },
              { content: { contains: args.searchString } },
            ],
          }
        : {}

      return prisma.bean.findMany({
        ...query,
        where: {
          published: true,
        },
        take: args.take ?? undefined,
        skip: args.skip ?? undefined,
      })
    },
  }),
}))

export const BeanCreateInput = builder.inputType('BeanCreateInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    website: t.string({ required: false }),
    image: t.string({ required: false }),
    tastingNotes: t.field({ type: [TastingNote], required: true}),
    process: t.field({ type: Process, required: true}),
    origin: t.field({ type: Origin, required: true}),
    roasterId: t.id({required: false})
  }),
})

builder.mutationFields((t) => ({
  createBean: t.prismaField({
    type: 'Bean',
    args: {
      data: t.arg({
        type: BeanCreateInput,
        required: true
      }),
      submitterId: t.arg.string({required: true}),
    },
    resolve: async (query, parent, args) => {
      const user = await prisma.user.findUnique({
        where: { id: args.submitterId },
      });

      if (!user) {
        throw new Error(`User with id ${args.submitterId} does not exist`);
      }
      
      return prisma.bean.create({
        ...query,
        data: {
          id: args.data.id,
          description: args.data.description,
          name: args.data.name,
          website: args.data.website,
          image: args.data.image,
          origin: args.data.origin,
          process: args.data.process,
          tastingNotes: args.data.tastingNotes,
          roaster: {
            connect: { id: args.data.roasterId }
          },
          submitter: {
            connect: { id: args.submitterId}
          }
        },
      })
    },
  }),
  togglePublishBean: t.prismaField({
    type: 'Bean',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, parent, args) => {
      // Toggling become simpler once this bug is resolved: https://github.com/prisma/prisma/issues/16715
      const postPublished = await prisma.bean.findUnique({
        where: { id: args.id},
        select: { published: true }
      })
      return prisma.bean.update({
        ...query,
        where: { id: args.id },
        data: { published: !postPublished?.published },
      })
    },
  }),
  deleteBean: t.prismaField({
    type: 'Bean',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: (query, parent, args) => {
      return prisma.bean.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
}))
