import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { IPublicationCommandRepository } from '../publication-command-repository';
import { Publication } from '@src/modules/animal/domain/publication';

@injectable()
export class PublicationCommandRepository implements IPublicationCommandRepository {
  constructor(@inject(TYPES.DynamoDBClient) private dynamoClient: DynamoDBClient) {}

  async save(publication: Publication): Promise<void> {
    const tableName = process.env.DYNAMO_PUBLICATION_TABLE;

    const putItemCommand = new PutItemCommand({
      TableName: tableName,
      Item: marshall(publication.toJson(), {
        convertClassInstanceToMap: true,
        removeUndefinedValues: true,
      }),
    });

    await this.dynamoClient.send(putItemCommand);
  }
}
