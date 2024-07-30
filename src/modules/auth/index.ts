import { FastifyInstance } from 'fastify';
import { FastifyRequestTypebox } from '../../types/fastify-typebox';
import { buildRequest } from '../../types/request';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import schema from './auth.schema'
import {UserService} from './auth.service';

const auth = async (fastify: FastifyInstance) => {
  const instance = fastify.withTypeProvider<TypeBoxTypeProvider>()
  const userService = UserService(instance)

  instance.post('/login',
    {
      schema: schema.login
    },
    async (request: FastifyRequestTypebox<typeof schema.login>) => {
      const response = await userService.login(
        buildRequest(request.body, "en", request)
      )
      return response
    }
  )

  instance.post('/refresh-token',
    {
      schema: schema.refreshToken
    },
    async (request: FastifyRequestTypebox<typeof schema.refreshToken>) => {
      const response = await userService.refreshToken(
        buildRequest(request.body, "en", request)
      )
      return response
    }
  )




}
export default auth
