import { Type } from '@sinclair/typebox';


const seed = {
  response: {
    200: Type.Object({
    done : Type.Boolean()
    }),
  },
};

export default {
  seed
}