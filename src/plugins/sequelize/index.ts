import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Sequelize } from 'sequelize-typescript';
import cls from 'cls-hooked';
import { TestUser } from '@@modules/testuser/user.model';
import { Client } from 'pg';




const sequelizePlugin = async (instance: FastifyInstance) => {
  const { name, username, password, host } = instance.configs.db;

  const createDatabaseIfNotExists = async () => {
    const client = new Client({
      user: username,
      host: host || 'localhost',
      password: password,
      port: 5432,
    });

    try {
      await client.connect();
      const res = await client.query(`SELECT 1 FROM pg_database WHERE datname=$1`, [name]);
      if (res.rowCount === 0) {
        await client.query(`CREATE DATABASE "${name}"`);
        instance.log.info(`Database "${name}" created successfully.`);
      }
    } catch (err: any) {
      instance.log.error(`Error creating database: ${err.message}`);
      throw err;
    } finally {
      await client.end();
    }
  }

  await createDatabaseIfNotExists();

  const namespace = cls.createNamespace('transaction-cls');
  Sequelize.useCLS(namespace);
  (Sequelize as any).DataTypes.postgres.DECIMAL.parse = parseFloat;

  const sequelize = new Sequelize({
    dialect: 'postgres',
    database: name,
    username,
    password,
    host: host || 'localhost',
    port: 5432,
    logging: (msg: string) => instance.log.debug(msg),
    dialectOptions: {
      ssl:
        instance.configs.instance.env === 'development' &&
          instance.configs.db.host.includes('localhost')
          ? false
          : {
            require: true,
            rejectUnauthorized: false,
          },
    },
    pool: {
      min: 0,
      max: 20,
      acquire: 60000,
      idle: 10000,
    },
    models: [TestUser],
  });

  sequelize.addHook('beforeCount', (options) => {
    if (options.include) {
      const includeArray = options.include as any[];
      if (includeArray.length) options.distinct = true;
    }
  });
  instance.decorate('db', sequelize);
  // instance.addHook('onClose',  async () => sequelize.close());

  try {
    await sequelize.authenticate({});
    instance.log.info(
      'Connection to database has been established successfully.',
    );
  } catch (error) {
    instance.log.error('Unable to connect to the database.');
    throw error;
  }
};

export default fp(sequelizePlugin, {
  name: 'sequelize-plugin',
});
