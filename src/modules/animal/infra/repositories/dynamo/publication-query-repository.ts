import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { IPublicationQueryRepository } from '../publication-query-repository';
import { Publication } from '@src/modules/animal/domain/publication';
import { PublicationMap } from './mappers/publication-map';

@injectable()
export class PublicationQueryRepository implements IPublicationQueryRepository {
  constructor(@inject(TYPES.DynamoDBClient) private dynamoClient: DynamoDBClient) {}

  async list(): Promise<Publication[]> {
    const queryCommand = new ScanCommand({
      TableName: process.env.DYNAMO_PUBLICATION_TABLE,
    });

    const result = await this.dynamoClient.send(queryCommand);

    if (!result.Items) return [];

    return result.Items?.map(x => PublicationMap.toDomain(unmarshall(x)));
  }
}
