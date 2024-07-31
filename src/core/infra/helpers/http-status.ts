import { HttpResponse } from '../http';

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json',
};

export const ok = (body?: any, headers: object = {}): HttpResponse => {
  return {
    statusCode: 200,
    body,
    headers: {
      ...headers,
      ...defaultHeaders,
    },
  };
};

export const created = (body?: any, headers: object = {}): HttpResponse => {
  return {
    statusCode: 201,
    body,
    headers: {
      ...headers,
      ...defaultHeaders,
    },
  };
};

export const accepted = (body?: any, headers: object = {}): HttpResponse => {
  return {
    statusCode: 202,
    body,
    headers: {
      ...headers,
      ...defaultHeaders,
    },
  };
};

export const badRequest = (error: object, headers: object = {}): HttpResponse => {
  return {
    statusCode: 400,
    body: { message: error },
    headers: {
      ...headers,
      ...defaultHeaders,
    },
  };
};

export const Unauthorized = (message?: string, headers: object = {}): HttpResponse => {
  return {
    statusCode: 401,
    body: { message: message || 'Unauthorized' },
    headers: {
      ...headers,
      ...defaultHeaders,
    },
  };
};

export const forbidden = (error: Error, headers: object = {}): HttpResponse => {
  return {
    statusCode: 403,
    body: { message: error.message },
    headers: {
      ...headers,
      ...defaultHeaders,
    },
  };
};

export const serverError = (headers: object = {}): HttpResponse => {
  return {
    statusCode: 500,
    body: { message: 'Internal server error' },
    headers: {
      ...headers,
      ...defaultHeaders,
    },
  };
};
