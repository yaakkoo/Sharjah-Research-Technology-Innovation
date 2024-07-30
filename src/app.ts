import fastify, { FastifyRequest } from 'fastify';
import 'dotenv/config'
import { Sequelize } from 'sequelize-typescript';
import helmet from '@fastify/helmet';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { getConfigs } from './configs/index';
import { TestUser } from '@@modules/testuser/user.model';


declare module 'fastify' {
  interface FastifyInstance {
    db: Sequelize;
    authorizeUser(request: FastifyRequest): Promise<TestUser>;
    authenticate: (request: FastifyRequest, reply: any) => Promise<void>;
    configs: Awaited<ReturnType<typeof getConfigs>>;
  }

  interface FastifyRequest {
    // hash a string using crypto builtin module
    hash: (text: string) => Promise<string>;
    // compare a string value to a hashed value
    verify: (text: string, hash: string) => Promise<boolean>;
    //get user location
  }
}

const getApp = async () => {
  const envToLogger = {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
    level: 'debug',
  };
  const app = fastify({
    logger:
      process.env.DEBUG === 'true' && process.env.NODE_ENV !== 'test'
        ? envToLogger
        : false,
    ajv: {
      customOptions: {
        strict: 'log',
        keywords: ['kind', 'modifier'],
      },
    },
    bodyLimit: 2097152
  }).withTypeProvider<TypeBoxTypeProvider>();

  const configs = await getConfigs();
  app.decorate('configs', configs);
  app.register(import('@fastify/auth'));
  app.register(import('@fastify/compress'));
  app.register(import('@fastify/sensible'));
  // const allowedOrigins = [
  //   "http://127.0.0.1:5501",
  //   "http://localhost:8080",
  // ];

  // app.register(import('@fastify/cors'), {
  //   origin: (origin, callback) => {
  //     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'), false);
  //     }
  //   },
  //   credentials: true,
  //   optionsSuccessStatus: 200
  // });

  app.register(import('@fastify/cors'), {
    origin: true,
    credentials: true,
  });

  app.register(import('./plugins/sequelize'));

  app.register(import('./plugins/jwt'));
  app.register(import('./plugins/auth'));
  app.register(import('./plugins/hash'));

  if (!app.configs.instance.isProduction) {
    await app.register(import('@fastify/swagger'), app.configs.swagger);
    app.register(helmet, instance => {
      return {
        contentSecurityPolicy: {
          directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "form-action": ["'self'"],
            "img-src": ["'self'", "data:", "validator.swagger.io"],
            "script-src": ["'self'"].concat(instance.swaggerCSP.script),
            "style-src": ["'self'", "https:"].concat(
              instance.swaggerCSP.style
            ),
          }
        }
      }
    })
  } else app.register(helmet);

  await app.register(import('@fastify/rate-limit'), {
    max: 200,
    timeWindow: '1 minute',
  });
  app.register(import('./modules/index'), {
    prefix: 'v1',
  });

  app.ready(async (err) => {
    if (err) {
      throw err;
    }

    //, force: true   options to reset DB on every start
    await app.db.sync({ alter: true, logging: false });

    const response = await app.inject({
      method: 'get',
      url: '/v1/global/seed',
    });

    if (response.json().done) {
      app.log.info('seeding done');
    }

    if (!configs.instance.isProduction) {
      app.swagger();
    }

  });

  return app;
};

export { getApp };
