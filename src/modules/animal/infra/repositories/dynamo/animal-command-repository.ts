import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IAnimalCommandRepository } from '../animal-command-repository';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Animal } from '@src/modules/animal/domain/animal';

@injectable()
export class AnimalCommandRepository implements IAnimalCommandRepository {
  constructor(@inject(TYPES.DynamoDBClient) private dynamoClient: DynamoDBClient) {}

  hardDelete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async save(animal: Animal): Promise<void> {
    const tableName = process.env.DYNAMO_ANIMAL_TABLE;

    const putItemCommand = new PutItemCommand({
      TableName: tableName,
      Item: marshall(animal.toJson(), {
        convertClassInstanceToMap: true,
        removeUndefinedValues: true,
      }),
    });

    await this.dynamoClient.send(putItemCommand);
  }
}
