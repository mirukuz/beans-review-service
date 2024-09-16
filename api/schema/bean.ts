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
    review: t.relation('review'),
    description: t.exposeString('description'),
    photo: t.exposeString('photo'),
    tastingNote: t.expose('tastingNote', { type: [TastingNote] }),
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
      //   orderBy: t.arg({
      //     type: ReviewOrderByUpdatedAtInput,
      //   }),
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
}))

export const BeanCreateInput = builder.inputType('BeanCreateInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    website: t.string({ required: false }),
    photo: t.string({ required: false }),
    tastingNotes: t.field({ type: [TastingNote], required: true}),
    process: t.field({ type: Process, required: true}),
    origin: t.field({ type: Origin, required: true}),
    roasterId: t.id({required: true})
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
          description: args.data.description,
          name: args.data.name,
          website: args.data.website,
          photo: args.data.photo,
          origin: args.data.origin,
          process: args.data.process,
          tastingNote: args.data.tastingNotes,
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
