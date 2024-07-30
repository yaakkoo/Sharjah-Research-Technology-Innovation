import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyRequestTypebox } from '../../types/fastify-typebox';
import { FastifyInstance } from 'fastify';
import schema from './global.schema'
import { GlobalService } from './global.service';
import { buildRequest } from '@@types/request';


const global = async (fastify: FastifyInstance) => {
  const instance = fastify.withTypeProvider<TypeBoxTypeProvider>()
  const globalService = GlobalService(instance)

  instance.get('/seed', {
    schema: schema.seed
  },
    async (request: FastifyRequestTypebox<typeof schema.seed>) => {
      const response = await globalService.seed(
        buildRequest(request.body, 'en', request)
      )
      return response
    }
  )

}

export default global