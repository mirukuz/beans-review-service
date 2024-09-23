import { builder } from '../builder'
import { prisma } from '../db'

builder.prismaObject('Roaster', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name'),
    published: t.exposeBoolean('published'),
    description: t.exposeString('description'),
    address: t.exposeString('address'),
    country: t.exposeString('country'),
    website: t.exposeString('website'),
    beans: t.relation('beans'),
    image: t.exposeString('image'),
  }),
})

// const SortOrder = builder.enumType('SortOrder', {
//   values: ['asc', 'desc'] as const,
// })

// const ReviewOrderByUpdatedAtInput = builder.inputType(
//   'ReviewOrderByUpdatedAtInput',
//   {
//     fields: (t) => ({
//       updatedAt: t.field({
//         type: SortOrder,
//         required: true,
//       }),
//     }),
//   },
// )

builder.queryFields((t) => ({
  roasterById: t.prismaField({
    type: 'Roaster',
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: (query, parent, args) =>
      prisma.roaster.findUnique({
        ...query,
        where: { id: args.id },
      }),
  }),
  allRoasters: t.prismaField({
    type: ['Roaster'],
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

      return prisma.roaster.findMany({
        ...query,
        take: args.take ?? undefined,
        skip: args.skip ?? undefined,
        // orderBy: args.orderBy ?? undefined,
      })
    },
  }),
  allUnpublishedRoasters: t.prismaField({
    type: ['Roaster'],
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

      return prisma.roaster.findMany({
        ...query,
        where: {
          published: false,
        },
        take: args.take ?? undefined,
        skip: args.skip ?? undefined,
      })
    },
  }),
  allPublishedRoasters: t.prismaField({
    type: ['Roaster'],
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

      return prisma.roaster.findMany({
        ...query,
        where: {
          published: true,
        },
        take: args.take ?? undefined,
        skip: args.skip ?? undefined,
      })
    },
  }),
  // draftsByUser: t.prismaField({
  //   type: ['Review'],
  //   nullable: true,
  //   args: {
  //     userUniqueInput: t.arg({
  //       type: UserUniqueInput,
  //       required: true,
  //     }),
  //   },
  //   resolve: (query, parent, args) => {
  //     return prisma.user
  //       .findUnique({
  //         where: {
  //           id: args.userUniqueInput.id ?? undefined,
  //           email: args.userUniqueInput.email ?? undefined,
  //         },
  //       })
  //       .reviews({
  //         ...query,
  //         where: {
  //           published: false,
  //         },
  //       })
  //   },
  // }),
}))

export const RoasterCreateInput = builder.inputType('RoasterCreateInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    country: t.string({ required: true }),
    address: t.string({ required: false }),
    website: t.string({ required: false }),
    image: t.string({ required: false }),
  }),
})

builder.mutationFields((t) => ({
  createRoaster: t.prismaField({
    type: 'Roaster',
    args: {
      data: t.arg({
        type: RoasterCreateInput,
        required: true
      }),
    },
    resolve: (query, parent, args) => {
      return prisma.roaster.create({
        ...query,
        data: {
          id: args.data.id,
          description: args.data.description,
          name: args.data.name,
          country: args.data.country,
          address: args.data.address,
          website: args.data.website,
          image: args.data.image
          // author: {
          //   connect: {
          //     email: args.authorEmail,
          //   },
          // },
        },
      })
    },
  }),
  togglePublishRoaster: t.prismaField({
    type: 'Roaster',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, parent, args) => {
      // Toggling become simpler once this bug is resolved: https://github.com/prisma/prisma/issues/16715
      const postPublished = await prisma.roaster.findUnique({
        where: { id: args.id},
        select: { published: true }
      })
      return prisma.roaster.update({
        ...query,
        where: { id: args.id },
        data: { published: !postPublished?.published },
      })
    },
  }),
  deleteRoaster: t.prismaField({
    type: 'Roaster',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: (query, parent, args) => {
      return prisma.roaster.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
}))
