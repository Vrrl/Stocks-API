import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { DynamoDBClient, QueryCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { Order } from '../../../domain/order';
import { throwIfUndefinedOrEmptyString } from '@src/core/infra/helpers/validation';
import { IOrderQueryRepository } from '../order-query-repository';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { OrderMap } from './mappers/order-map';

@injectable()
export class OrderQueryRepository implements IOrderQueryRepository {
  DYNAMO_ORDERS_TABLE: string;

  constructor(@inject(TYPES.DynamoDBClient) private dynamoClient: DynamoDBClient) {
    this.DYNAMO_ORDERS_TABLE = throwIfUndefinedOrEmptyString(
      process.env.DYNAMO_ORDERS_TABLE,
      'Env Parameter DYNAMO_ORDERS_TABLE is required',
    );
  }

  async listByShareholderId(shareholderId: string): Promise<Order[]> {
    const queryCommand = new QueryCommand({
      TableName: this.DYNAMO_ORDERS_TABLE,
      KeyConditionExpression: 'shareholderId = :shareholderId',
      ExpressionAttributeValues: marshall(
        {
          ':shareholderId': shareholderId,
        },
        { removeUndefinedValues: true },
      ),
    });

    const result = await this.dynamoClient.send(queryCommand);

    if (!result.Items) return [];

    return result.Items.map(x => OrderMap.toDomain(unmarshall(x)));
  }

  async getByShareholderId(shareholderId: string, id: string): Promise<Order | undefined> {
    const queryCommand = new GetItemCommand({
      TableName: this.DYNAMO_ORDERS_TABLE,
      Key: marshall({
        shareholderId,
        id,
      }),
    });

    const result = await this.dynamoClient.send(queryCommand);

    if (!result.Item) return undefined;

    return OrderMap.toDomain(unmarshall(result.Item));
  }

  async getById(id: string): Promise<Order | undefined> {
    const queryCommand = new QueryCommand({
      TableName: this.DYNAMO_ORDERS_TABLE,
      IndexName: 'id-index',
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: marshall({
        ':id': id,
      }),
      Limit: 1,
    });

    const result = await this.dynamoClient.send(queryCommand);

    if (!result.Items || !result.Items.length) return undefined;

    return OrderMap.toDomain(unmarshall(result.Items[0]));
  }
}
