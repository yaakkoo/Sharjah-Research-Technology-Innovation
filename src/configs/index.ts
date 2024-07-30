import { Type } from '@sinclair/typebox';
import 'dotenv/config'
import envSchema from 'env-schema';

const getConfigs = async () => {
  const env = envSchema({
    dotenv: process.env.NODE_ENV === 'development' ? true : false,
    schema: Type.Object({
      NODE_ENV: Type.String(),
      API_HOST: Type.String(),
      API_PORT: Type.String({ default: 8080 }),
      DB_HOST: Type.String(),
      DB_NAME: Type.String(),
      DB_USERNAME: Type.String(),
      DB_PASSWORD: Type.String(),
      JWT_SECRET: Type.String(),
      JWT_EXPIRE: Type.String(),
      REFRESH_TOKEN_EXPIRE: Type.String(),
      ADMIN_PASSWORD: Type.String(),

    }),
  });

  const isProduction = /^\s*production\s*$/i.test(`${env['NODE_ENV']}`);

  return {
    admin: {
      password: `${env.ADMIN_PASSWORD}`,
    },
    instance: {
      env: `${env.NODE_ENV}`,
      host: `${env.API_HOST}`,
      port: process.env.PORT ? +`${process.env.PORT}` : +`${env['API_PORT']}`,
      isProduction
    },
    db: {
      host: `${env['DB_HOST']}`,
      name: `${env['DB_NAME']}`,
      testName: `${env['TEST_DB_NAME']}`,
      password: `${env['DB_PASSWORD']}`,
      username: `${env['DB_USERNAME']}`,
      seed: /^\s*true\s*$/i.test(`${env['ENABLE_SEED']}`),
    },
    jwt: {
      expire: `${env['JWT_EXPIRE']}`,
      secret: `${env['JWT_SECRET']}`,
      refreshTokenExpire: `${env['REFRESH_TOKEN_EXPIRE']}`,
    },
    swagger: {
      routePrefix: '/v1/docs',

      openapi: {
        info: {
          title: 'Api service for Table Ninja',
          description: '',
          version: '2.0.0',
        },
        schemes: ["http", "https"],
        externalDocs: {
          url: 'https://swagger.io/specification/',
          description: 'Find more info here',
        },
        servers: [
          {
            url: `${env['API_HOST']}`,
          },
        ],
        components: {
          securitySchemes: {
            userToken: {
              type: 'apiKey' as const,
              name: 'Authorization',
              in: 'header',
            },
          },
        },
      },
      hideUntagged: true,
      exposeRoute: true,
    },
  };
};

export { getConfigs };
