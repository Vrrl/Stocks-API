import { AWS } from '@serverless/typescript';
import { IQueueMessage } from './queue';
import { QueueController } from './queue-controller';
import { IRouter } from './router';
import { getServerlessModuleHandlerPath } from '../utils/get-serverless-module-handle-path';

type route = {
  queue: string;
  controller: QueueController<IQueueMessage>;
  batchSize?: number;
  maximumConcurrency?: number;
};

export class QueueRouter implements IRouter {
  constructor() {
    this.rawRoutes = [];
  }

  rawRoutes: route[];

  public toServerlessFunctions(dirName: string): AWS['functions'] {
    return Object.fromEntries(
      this.routes.map(({ queue, batchSize, controller, maximumConcurrency }) => {
        return [
          `${controller.constructor.name}`,
          {
            handler: `${getServerlessModuleHandlerPath(dirName)}/functions.queue`,
            events: [
              {
                sqs: {
                  arn: `arn:aws:sqs:${process.env.REGION}:${process.env.ACCOUNT_ID}:${queue}`,
                  batchSize,
                  maximumConcurrency,
                },
              },
            ],
          },
        ];
      }),
    );
  }

  get routes(): route[] {
    return this.rawRoutes;
  }

  addRoute(route: route): void {
    this.rawRoutes.push(route);
  }
}
