import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { BatchGetItemCommand, DynamoDBClient, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Animal } from '@src/modules/animal/domain/animal';
import { IAnimalQueryRepository } from '../animal-query-repository';
import { AnimalMap } from './mappers/animal-map';

@injectable()
export class AnimalQueryRepository implements IAnimalQueryRepository {
  constructor(@inject(TYPES.DynamoDBClient) private dynamoClient: DynamoDBClient) {}

  async list({ params }: { params: Record<string, string | undefined> }): Promise<Animal[]> {
    const queryCommand = new ScanCommand({
      TableName: process.env.DYNAMO_ANIMAL_TABLE,
    });

    const result = await this.dynamoClient.send(queryCommand);

    if (!result.Items) return [];

    return result.Items?.map(x => AnimalMap.toDomain(unmarshall(x)));
  }

  async getBatch(ids: string[]): Promise<Animal[]> {
    const batchGetItemCommand = new BatchGetItemCommand({
      RequestItems: {
        [process.env.DYNAMO_ANIMAL_TABLE!]: {
          Keys: ids.map(x => {
            return { id: { S: x } };
          }),
        },
      },
    });

    const result = await this.dynamoClient.send(batchGetItemCommand);

    if (!result.Responses || !result.Responses[process.env.DYNAMO_ANIMAL_TABLE!]) return [];

    return result.Responses[process.env.DYNAMO_ANIMAL_TABLE!].map(x => AnimalMap.toDomain(unmarshall(x)));
  }

  async getById(id: string): Promise<Animal | undefined> {
    const queryCommand = new QueryCommand({
      TableName: process.env.DYNAMO_ANIMAL_TABLE,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: marshall({
        ':id': id,
      }),
      ScanIndexForward: false,
      Limit: 1,
    });

    const result = await this.dynamoClient.send(queryCommand);

    if (!result || !result.Items || !result.Items[0]) return;

    return AnimalMap.toDomain(unmarshall(result.Items[0]));
  }
}
