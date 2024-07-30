import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest } from 'fastify';
import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number };
    user: {
      id: number;

      email: string;

      verified: boolean;

      role: string;
    };
  }
}

const jwtPlugin = async (instance: FastifyInstance) => {
  instance.register(import('@fastify/jwt'), {
    secret: instance.configs.jwt.secret,
  });

  instance.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: any) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    },
  );

  instance.decorate('isAuthenticated', async (request: FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      throw instance.httpErrors.unauthorized();
    }
  });
};

export default fp(jwtPlugin, {
  name: 'jwt-plugin',
});

// check if user is authenticated without throwing error (used for check user location)
// instance.decorate('isAuthenticated', async (request: FastifyRequest) => {
//     try {
//         await request.jwtVerify();
//     } catch (error) {
//         return;
//     }
// });
