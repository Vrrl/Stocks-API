import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { IAdoptionCommandRepository } from '../adoption-command-repository';
import { AdoptionRequest } from '@src/modules/animal/domain/adoption-request';

@injectable()
export class AdoptionCommandRepository implements IAdoptionCommandRepository {
  constructor(@inject(TYPES.DynamoDBClient) private dynamoClient: DynamoDBClient) {}

  async saveRequest(adoptionRequest: AdoptionRequest): Promise<void> {
    const tableName = process.env.DYNAMO_ADOPTION_TABLE;

    const putItemCommand = new PutItemCommand({
      TableName: tableName,
      Item: marshall(adoptionRequest.toJson(), {
        convertClassInstanceToMap: true,
        removeUndefinedValues: true,
      }),
    });

    await this.dynamoClient.send(putItemCommand);
  }
}
