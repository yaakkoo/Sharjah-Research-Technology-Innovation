import { FastifyInstance } from 'fastify';
import { FastifyRequestTypebox } from '../../types/fastify-typebox';
import { buildPaginationRequest, buildRequest } from '../../types/request';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import schema from './user.schema'
import { TestService } from './user.service';

const TablesConstoller = async (fastify: FastifyInstance) => {
  const instance = fastify.withTypeProvider<TypeBoxTypeProvider>()
  const testService = TestService(instance)

  instance.get('/users',
    {
      // preValidation: instance.auth(
      //   [instance.authenticate, instance.authorizeUser],
      //   {
      //     relation: 'and'
      //   }
      // ),
      schema: schema.getUsers
    },
    async (request: FastifyRequestTypebox<typeof schema.getUsers>) => {
      const response = await testService.getUsers(
        buildRequest(request.body, 'en', request)
      )
      return response
    }
  )
  instance.post('/new-user',
    {
      preValidation: instance.auth(
        [instance.authenticate, instance.authorizeUser],
        {
          relation: 'and'
        }
      ),
      schema: schema.createUser
    },
    async (request: FastifyRequestTypebox<typeof schema.createUser>) => {
      const response = await testService.createUser(
        buildRequest(request.body, 'en', request)
      )
      return response
    }
  )
  instance.put('/edit-user',
    {
      preValidation: instance.auth(
        [instance.authenticate, instance.authorizeUser],
        {
          relation: 'and'
        }
      ),
      schema: schema.editUser
    },
    async (request: FastifyRequestTypebox<typeof schema.editUser>) => {
      const response = await testService.editUser(
        buildRequest(request.body, 'en', request)
      )
      return response
    }
  )
  instance.delete('/:userId/delete-user',
    {
      preValidation: instance.auth(
        [instance.authenticate, instance.authorizeUser],
        {
          relation: 'and'
        }
      ),
      schema: schema.deleteUser
    },
    async (request: FastifyRequestTypebox<typeof schema.deleteUser>) => {
      const response = await testService.deleteUser(
        buildRequest(request.body, 'en', request)
      )
      return response
    }
  )
  instance.put('/:userId/change-password',
    {
      preValidation: instance.auth(
        [instance.authenticate, instance.authorizeUser],
        {
          relation: 'and'
        }
      ),
      schema: schema.editUserPassword
    },
    async (request: FastifyRequestTypebox<typeof schema.editUserPassword>) => {
      const response = await testService.editUserPassword(
        buildRequest(request.body, 'en', request)
      )
      return response
    }
  )



}

export default TablesConstoller