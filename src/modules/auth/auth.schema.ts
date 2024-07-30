import { Type } from "@sinclair/typebox";


const AdminUserResponse = Type.Object({
  id: Type.Number(),
  email: Type.String({ format: 'email' }),
  verified: Type.Boolean(),
  role: Type.String(),
  accessToken: Type.Optional(Type.String()),
  refreshToken: Type.Optional(Type.String()),
});


const login = {
  description: 'LOGIN',
  tags: ['Auth'],
  body: Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 8 }),
  }),
  response: {
    200: AdminUserResponse
  },
}

const refreshToken = {
  description: 'refresh Token',
  tags: ['Auth'],
  body: Type.Object({
    token: Type.String(),
  }),
  response: {
    200: AdminUserResponse
  },
}


export default {
  login,
  refreshToken
}