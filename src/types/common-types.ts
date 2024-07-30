import { Static, Type } from '@sinclair/typebox';

// responses
export const responseMessage = Type.Object({
  message: Type.String(),
});
export type responseMessageType = Static<typeof responseMessage>;

// params
export const idParamObject = Type.Object({
  id: Type.Number(),
});

export const paginatedResponse = Type.Object({
  count: Type.Number(),
  rows: Type.Any(),
});

export const LangObjectType = Type.Object({
  en: Type.String(),
  ar: Type.String(),
});

export const phoneRegex = /^(\+\d{1,3})?(\d{1,10})?$/.source;

export const timeAndDateRegex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.source
