import { builder } from '../builder'
import { prisma } from '../db'

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name', { nullable: true }),
    email: t.exposeString('email'),
    avatar: t.exposeString('avatar', { nullable: true }),
    reviews: t.relation('reviews'),
    reviewedBeans: t.prismaConnection({
      type: 'Bean',
      cursor: 'id',
      resolve: async (query, user, args, context, info) => {
        const reviewedBeans = await prisma.bean.findMany({
          ...query,
          where: {
            review: {
              some: {
                authorId: user.id,
              },
            },
          },
        })
        return reviewedBeans
      },
    }),
    submittedBeans: t.prismaConnection({
      type: 'Bean',
      cursor: 'id',
      resolve: async (query, user, args, context, info) => {
        const reviewedBeans = await prisma.bean.findMany({
          ...query,
          where: {
            submitterId: user.id
          },
        })
        return reviewedBeans
      },
    }),
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
    avatar: t.string(),
  }),
})

builder.mutationFields((t) => ({
  signupUser: t.prismaField({
    type: 'User',
    args: {
      data: t.arg({
        type: UserCreateInput,
        required: true,
      }),
    },
    resolve: async (query, parent, args ) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: args.data.email },
      });
  
      if (existingUser) {
        return existingUser;
      }
      return prisma.user.create({
        ...query,
        data: {
          email: args.data.email,
          name: args.data.name,
          avatar: args.data.avatar
        },
      })
    },
  }),
}))
