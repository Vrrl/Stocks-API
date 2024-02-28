import moment from 'moment';
import { AdoptionRequestStatusEnum } from './adoption-request-status';
import { Entity } from '@src/core/domain/entity';

export interface AdoptionRequestProps {
  requesterId: string;
  animalId: string;
  status: AdoptionRequestStatusEnum;
  approvedBy?: string;
  requestedAt: number;
  updatedAt?: number;
}

export class AdoptionRequest extends Entity<AdoptionRequestProps> {
  get animalId() {
    return this.props.animalId;
  }

  get requesterId() {
    return this.props.requesterId;
  }

  static newRequest(requesterId: string, animalId: string) {
    return AdoptionRequest.createFromPrimitive({
      requesterId,
      animalId,
      status: 'awaiting',
      requestedAt: moment().unix(),
    });
  }

  static createFromPrimitive(
    props: {
      requesterId: string;
      animalId: string;
      status: AdoptionRequestStatusEnum;
      approvedBy?: string;
      requestedAt: number;
      updatedAt?: number;
    },
    id?: string,
  ) {
    return new AdoptionRequest(
      {
        requesterId: props.requesterId,
        animalId: props.animalId,
        status: props.status,
        approvedBy: props.approvedBy,
        requestedAt: props.requestedAt,
        updatedAt: props.updatedAt,
      },
      id,
    );
  }

  public toJson(): object {
    return {
      id: this.id,
      requesterId: this.props.requesterId,
      animalId: this.props.animalId,
      status: this.props.status,
      approvedBy: this.props.approvedBy,
      requestedAt: this.props.requestedAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
