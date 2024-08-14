import { AwsArn } from '@serverless/typescript';
import { IQueueMessage } from './queue';
import { QueueController } from './queue-controller';
import { IRouter } from './router';
import { getServerlessModuleHandlerPath } from '../utils/get-serverless-module-handle-path';

type route = {
  queue: AwsArn;
  controller: QueueController<IQueueMessage>;
  batchSize?: number;
  maximumConcurrency?: number;
};

export class QueueRouter implements IRouter {
  constructor() {
    this.rawRoutes = [];
  }

  rawRoutes: route[];

  public toServerlessFunctions(dirName: string) {
    return Object.fromEntries(
      this.routes.map(({ queue, batchSize, controller, maximumConcurrency }) => [
        `${controller.constructor.name}`,
        {
          handler: `${getServerlessModuleHandlerPath(dirName)}/functions.queue`,
          events: [
            {
              sqs: {
                // arn: {
                //   'Fn::GetAtt': [queue, 'Arn'],
                // },
                arn: 'arn:aws:sqs:region:XXXXXX:' + queue,
                batchSize,
                maximumConcurrency,
              },
            },
          ],
        },
      ]),
    );
  }

  get routes(): route[] {
    return this.rawRoutes;
  }

  addRoute(route: route): void {
    this.rawRoutes.push(route);
  }
}
