import {
  FastifyRequest,
  FastifyInstance,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  RawServerDefault,
  FastifySchema,
  FastifyBaseLogger,
} from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export type FastifyRequestTypebox<TSchema extends FastifySchema> =
  FastifyRequest<
    RouteGenericInterface,
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    TSchema,
    TypeBoxTypeProvider
  >;

export type FastifyTypebox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;
