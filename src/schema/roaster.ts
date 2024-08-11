import { builder } from '../builder'
import { prisma } from '../db'

builder.prismaObject('Roaster', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    address: t.exposeString('address'),
    country: t.exposeString('country'),
    website: t.exposeString('website'),
    bean: t.relation('bean'),
    photo: t.exposeString('photo'),
  }),
})

export const RoasterCreateInput = builder.inputType('RoasterCreateInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    content: t.string(),
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

builder.mutationFields((t) => ({
  // createDraft: t.prismaField({
  //   type: 'Review',
  //   args: {
  //     data: t.arg({
  //       type: ReviewCreateInput,
  //       required: true,
  //     }),
  //     authorEmail: t.arg.string({ required: true }),
  //   },
  //   resolve: (query, parent, args) => {
  //     return prisma.review.create({
  //       ...query,
  //       data: {
  //         content: args.data.content ?? undefined,
  //         published: false,
  //         author: {
  //           connect: {
  //             email: args.authorEmail,
  //           },
  //         },
  //       },
  //     })
  //   },
  // }),
  // togglePublishReview: t.prismaField({
  //   type: 'Review',
  //   args: {
  //     id: t.arg.string({ required: true }),
  //   },
  //   resolve: async (query, parent, args) => {
  //     // Toggling become simpler once this bug is resolved: https://github.com/prisma/prisma/issues/16715
  //     const reviewPublished = await prisma.review.findUnique({
  //       where: { id: args.id},
  //       select: { published: true }
  //     })
  //     console.log(reviewPublished)
  //     return prisma.review.update({
  //       ...query,
  //       where: { id: args.id },
  //       data: { published: !reviewPublished?.published },
  //     })
  //   },
  // }),
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
