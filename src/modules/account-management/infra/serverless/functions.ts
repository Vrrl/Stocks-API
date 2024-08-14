import { AWS } from '@serverless/typescript';
import { middyHttpRouterAdapter } from '../../../../infra/http/adapters/middy-http-router-adapters';
import router from '../http/routes';

export const main = middyHttpRouterAdapter(router);

const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};

const functions: AWS['functions'] = Object.fromEntries(
  router.routes.map(({ path, method, controller }) => [
    `${controller.constructor.name}`,
    {
      handler: `${handlerPath(__dirname)}/functions.main`,
      events: [
        {
          http: {
            method,
            path,
            cors: true,
          },
        },
      ],
    },
  ]),
);

export default functions;
