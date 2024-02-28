import moment from 'moment';
import { Entity } from '@src/core/domain/entity';
import { PublicationDescription } from './publication-description';

export interface PublicationProps {
  ownerId: string;
  animalId: string;
  description?: PublicationDescription;
  createdAt: number;
}

export class Publication extends Entity<PublicationProps> {
  get animalId() {
    return this.props.animalId;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static newPublication(ownerId: string, animalId: string, description?: string) {
    return Publication.createFromPrimitive({
      ownerId,
      animalId,
      description,
      createdAt: moment().unix(),
    });
  }

  static createFromPrimitive(
    props: {
      ownerId: string;
      animalId: string;
      description?: string;
      createdAt: number;
    },
    id?: string,
  ) {
    return new Publication(
      {
        ownerId: props.ownerId,
        animalId: props.animalId,
        description: PublicationDescription.create({ description: props.description }),
        createdAt: props.createdAt,
      },
      id,
    );
  }

  public toJson(): object {
    return {
      id: this.id,
      ownerId: this.props.ownerId,
      animalId: this.props.animalId,
      description: this.props.description?.value,
      createdAt: this.props.createdAt,
    };
  }
}
