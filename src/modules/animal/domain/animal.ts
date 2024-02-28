import { AggregateRoot } from '@src/core/domain/aggregate-root';
import { AnimalName } from './animal-name';
import { AnimalTypeEnum } from './animal-type-enum';
import { AnimalStatusEnum } from './animal-status-enum';
import { AnimalWeigth } from './animal-weigth';
import { AnimalSizeEnum } from './animal-size-enum';
import { AnimalAge } from './animal-age';
import moment from 'moment';
import { UseCaseError } from '@src/core/errors';

export interface AnimalProps {
  rescuerId: string;
  name: AnimalName;
  type: AnimalTypeEnum;
  status: AnimalStatusEnum;
  lastWeigth?: AnimalWeigth;
  size: AnimalSizeEnum;
  age: AnimalAge;
  registeredAt: number;
  shelteredAt?: number;
  imageUrl: string;
  lastLocation?: string;
}

export class Animal extends AggregateRoot<AnimalProps> {
  get rescuerId() {
    return this.props.rescuerId;
  }

  claim(rescuerId: string) {
    if (this.props.status !== 'lost') throw new UseCaseError('Cannot claim animals not lost');
    if (!rescuerId) throw new UseCaseError('Cannot claim animal without rescuerId');

    this.props.status = 'sheltered';
    this.props.rescuerId = rescuerId;
  }

  static createFromPrimitive(
    props: {
      rescuerId: string;
      name?: string;
      type: AnimalTypeEnum;
      size: AnimalSizeEnum;
      status: AnimalStatusEnum;
      ageInMonths?: number;
      registeredAt: number;
      lastWeigth?: number;
      shelteredAt?: number;
      imageUrl: string;
      lastLocation?: string;
    },
    id?: string,
  ) {
    return new Animal(
      {
        rescuerId: props.rescuerId,
        name: AnimalName.create({ name: props.name }),
        type: props.type,
        status: props.status,
        lastWeigth: AnimalWeigth.create({ weigth: props.lastWeigth }),
        size: props.size,
        age: AnimalAge.create({ ageInMonths: props.ageInMonths }),
        registeredAt: props.registeredAt,
        shelteredAt: props.shelteredAt,
        imageUrl: props.imageUrl,
        lastLocation: props.lastLocation,
      },
      id,
    );
  }

  public static createSheltered(
    props: {
      rescuerId: string;
      name: string;
      type: AnimalTypeEnum;
      size: AnimalSizeEnum;
      ageInMonths: number;
      lastWeigth?: number;
      shelteredAt?: number;
      imageUrl: string;
    },
    id?: string,
  ): Animal {
    if (!props.name) throw new UseCaseError('Cannot create sheltered animal without name');
    if (!props.type) throw new UseCaseError('Cannot create sheltered animal without type');
    if (!props.size) throw new UseCaseError('Cannot create sheltered animal without size');
    if (!props.imageUrl) throw new UseCaseError('Cannot create sheltered animal without image');

    return Animal.createFromPrimitive(
      {
        ...props,
        status: 'sheltered',
        registeredAt: moment().unix(),
        shelteredAt: props.shelteredAt ?? moment().unix(),
      },
      id,
    );
  }

  public static createLost(
    props: {
      rescuerId: string;
      type: AnimalTypeEnum;
      size: AnimalSizeEnum;
      ageInMonths?: number;
      lastWeigth?: number;
      imageUrl: string;
      lastLocation: string;
    },
    id?: string,
  ): Animal {
    if (!props.type) throw new UseCaseError('Cannot create lost animal without type');
    if (!props.size) throw new UseCaseError('Cannot create lost animal without size');
    if (!props.lastLocation) throw new UseCaseError('Cannot create lost animal without lastLocation');

    return Animal.createFromPrimitive(
      {
        ...props,
        status: 'lost',
        registeredAt: moment().unix(),
      },
      id,
    );
  }

  public toJson(): object {
    return {
      id: this.id,
      rescuerId: this.props.rescuerId,
      name: this.props.name.value,
      type: this.props.type,
      size: this.props.size,
      status: this.props.status,
      ageInMonths: this.props.age.months,
      registeredAt: this.props.registeredAt,
      lastWeigth: this.props.lastWeigth?.value,
      shelteredAt: this.props.shelteredAt,
      imageUrl: this.props.imageUrl,
      lastLocation: this.props.lastLocation,
    };
  }
}
