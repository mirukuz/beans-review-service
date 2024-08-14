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
builder.prismaObject('Bean', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name'),
    roaster: t.relation('roaster'),
    review: t.relation('review'),
    photo: t.exposeString('photo'),
    tastingNote: t.expose('tastingNote', { type: TastingNote }),
    process: t.expose('process', { type: Process }),
    website: t.exposeString('website'),
    origin: t.exposeString('origin'),
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
    country: t.string({ required: true }),
    address: t.string({ required: true }),
    website: t.string({ required: false }),
    photo: t.string({ required: false }),
    tastingnote: t.field({ type: TastingNote, required: true}),
    process: t.field({ type: Process, required: true}),
    origin: t.string({ required: true}),
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
      user: t.arg.string()
    },
    resolve: (query, parent, args) => {
      return prisma.bean.create({
        ...query,
        data: {
          description: args.data.description,
          name: args.data.name,
          website: args.data.website,
          photo: args.data.photo,
          origin: args.data.origin,
          process: args.data.process,
          tastingNote: args.data.tastingnote,
          roaster: {
            connect: { id: args.data.roasterId }
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
