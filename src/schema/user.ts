import { builder } from '../builder'
import { prisma } from '../db'
import { ReviewCreateInput } from "./review"

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name', { nullable: true }),
    email: t.exposeString('email'),
    reviews: t.relation('reviews'),
  }),
})

builder.queryFields((t) => ({
  userById: t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: (query, parent, args) =>
      prisma.user.findUnique({
        ...query,
        where: { id: args.id },
      }),
  }),
  allUsers: t.prismaField({
    type: ['User'],
    resolve: (query) => prisma.user.findMany({ ...query }),
  }),
}))

export const UserUniqueInput = builder.inputType('UserUniqueInput', {
  fields: (t) => ({
    id: t.int(),
    email: t.string(),
  }),
})

const UserCreateInput = builder.inputType('UserCreateInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    name: t.string(),
    reviews: t.field({ type: [ReviewCreateInput] }),
  }),
})

// builder.mutationFields((t) => ({
//   signupUser: t.prismaField({
//     type: 'User',
//     args: {
//       data: t.arg({
//         type: UserCreateInput,
//         required: true,
//       }),
//     },
//     resolve: (query, parent, args) => {
//       return prisma.user.create({
//         ...query,
//         data: {
//           email: args.data.email,
//           name: args.data.name,
//           reviews: {
//             create: (args.data ?? []).map((review) => ({
//               content: review.content ?? undefined,
//             })),
//           },
//         },
//       })
//     },
//   }),
// }))
