import { FastifyInstance } from 'fastify';

import globals from '@@modules/global/index';
import login from '@@modules/auth/index';
import tests from '@@modules/testuser/index';

const modules = async (instance: FastifyInstance) => {
  instance.register(login, { prefix: 'login' });
  instance.register(globals, { prefix: 'global' });
  instance.register(tests, { prefix: 'tests' });

};

export default modules;
