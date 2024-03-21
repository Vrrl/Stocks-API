import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Order } from '../../../domain/order';
import { IOrderCommandRepository } from '../order-command-repository';
import { throwIfUndefinedOrEmptyString } from '@src/core/infra/helpers/validation';

@injectable()
export class OrderCommandRepository implements IOrderCommandRepository {
  DYNAMO_ORDERS_TABLE: string;

  constructor(@inject(TYPES.DynamoDBClient) private dynamoClient: DynamoDBClient) {
    this.DYNAMO_ORDERS_TABLE = throwIfUndefinedOrEmptyString(
      process.env.DYNAMO_ORDERS_TABLE,
      'Env Parameter DYNAMO_ORDERS_TABLE is required',
    );
  }

  async save(order: Order): Promise<void> {
    const tableName = this.DYNAMO_ORDERS_TABLE;

    const putItemCommand = new PutItemCommand({
      TableName: tableName,
      Item: marshall(order.toJson(), {
        convertClassInstanceToMap: true,
        removeUndefinedValues: true,
      }),
    });

    await this.dynamoClient.send(putItemCommand);
  }
}
