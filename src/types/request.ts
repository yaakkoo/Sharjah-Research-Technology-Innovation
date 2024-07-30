import { FastifyRequest } from 'fastify';

export interface RequestData<T> {
  data: T;
  langCode: string;
  request?: FastifyRequest;
}

export const buildRequest = <T>(
  data: T,
  langCode: string,
  request?: FastifyRequest,
) => {
  return {
    data,
    langCode,
    request,
  };
};

export interface RequestDataWithFile<T> {
  file: T;
  langCode: string;
  request?: FastifyRequest;
}

export const buildRequestWithFile = <T>(
  file: T,
  langCode: string,
  request?: FastifyRequest,
) => {
  return {
    file,
    langCode,
    request,
  };
};

export interface PaginatedRequest<T> {
  limit: number;
  offset: number;
  langCode: string;
  request: FastifyRequest;
  data?: T;
}
export const buildPaginationRequest = <T>(
  limit: number,
  offset: number,
  langCode: string,
  request: FastifyRequest,
  data?: T,
) => {
  return {
    limit,
    offset,
    langCode,
    request,
    data,
  };
};
export interface JObject {
  [key: string]: any;
}
export interface LangObject {
  en: string;
  ar: string;
}
