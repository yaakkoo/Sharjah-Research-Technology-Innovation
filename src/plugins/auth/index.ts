import { TestUser } from '@@modules/testuser/user.model';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';


const authorizePlugin = async (instance: FastifyInstance) => {
  instance.decorate('authorizeUser', async (request: FastifyRequest) => {
    const payload = request.user as any;
    const lang = request.headers['x-lang'] as string;
    const user = await TestUser.findOne({
      where: {
        id: payload.id
      }
    })
    if (!user)
      throw instance.httpErrors.unauthorized();
    return user
  });



};

export default fp(authorizePlugin, {
  name: 'authorize-plugin',
});
