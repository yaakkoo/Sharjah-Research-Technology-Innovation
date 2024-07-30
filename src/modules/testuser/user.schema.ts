import { Type } from "@sinclair/typebox";

const user = Type.Any()

const getUsers = {
  description: 'get users',
  tags: ['test user'],
  // security: [
  //   {
  //     user: [],
  //   },
  // ],
  response: {
    200: Type.Object({
      users: Type.Array(user)
    })
  },
}

const createUser = {
  description: 'create users',
  tags: ['test user'],
  security: [
    {
      userToken: [],
    },
  ],
  body: Type.Object({
    email: Type.String({ format: 'email' }),
    name: Type.String(),
    phone: Type.String(),
    address: Type.String(),
    emirate: Type.String(),
    date_of_birth: Type.String(),
    password: Type.String(),
    country: Type.String(),
    city: Type.String(),
    isAdmin: Type.Boolean(),
    can_add: Type.Boolean(),
    can_edit: Type.Boolean(),
  }),
  response: {
    200: Type.Object({
      user: user
    })
  },
}

const editUser = {
  description: 'create users',
  tags: ['test user'],
  security: [
    {
      userToken: [],
    },
  ],
  body: Type.Object({
    id: Type.Number(),
    email: Type.String({ format: 'email' }),
    name: Type.String(),
    emirate: Type.String(),
    phone: Type.String(),
    address: Type.String(),
    date_of_birth: Type.String(),
    country: Type.String(),
    city: Type.String(),
    can_add: Type.Boolean(),
    can_edit: Type.Boolean(),
  }),
  response: {
    200: Type.Object({
      user: user
    })
  },
}

const deleteUser = {
  description: 'delete users',
  tags: ['test user'],
  security: [
    {
      userToken: [],
    },
  ],
  params: Type.Object({
    userId: Type.Number()
  }),
  response: {
    200: Type.Object({
      done: Type.Boolean()
    })
  },
}


const editUserPassword = {
  description: 'editUserPassword',
  tags: ['test user'],
  security: [
    {
      userToken: [],
    },
  ],
  params: Type.Object({
    userId: Type.Number()
  }),
  body: Type.Object({
    password: Type.String()
  }),
  response: {
    200: Type.Object({
      done: Type.Boolean()
    })
  },
}


export default {
  getUsers,
  createUser,
  editUser,
  deleteUser,
  editUserPassword
}