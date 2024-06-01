import {
  throwIfNotNumber,
  throwIfUndefined,
  throwIfUndefinedOrEmptyString,
  throwIfUndefinedOrNotEnum,
} from '@src/core/infra/helpers/validation';
import { OrderExpirationTypeEnum } from './order-expiration-type-enum';
import { OrderStatusEnum } from './order-status-enum';
import { OrderTypeEnum } from './order-type-enum';

type OrderProps = {
  id: string;
  type: OrderTypeEnum;
  unitValue: number;
  quantity: number;
  status: OrderStatusEnum;
  createdAtTimestamp: number;
  expirationType: OrderExpirationTypeEnum;
  expirationTimestamp: number | null;
};

export class Order {
  constructor(props: OrderProps) {
    throwIfUndefinedOrEmptyString(props.id, 'Invalid parameter id in Order Class');
    throwIfUndefinedOrNotEnum(props.type, OrderTypeEnum, 'Invalid parameter type in Order Class');
    throwIfNotNumber(props.unitValue, 'Invalid parameter value in Order Class');
    throwIfNotNumber(props.quantity, 'Invalid parameter quantity in Order Class');
    throwIfUndefinedOrNotEnum(props.status, OrderStatusEnum, 'Invalid parameter status in Order Class');
    throwIfNotNumber(props.createdAtTimestamp, 'Invalid parameter createdAtTimestamp in Order Class');
    throwIfUndefinedOrNotEnum(
      props.expirationType,
      OrderExpirationTypeEnum,
      'An valid parameter expirationType is required in Order Class',
    );
    throwIfUndefined(props.expirationTimestamp, 'Invalid parameter expirationTimestamp in Order Class');

    this.props = props;
  }

  props: OrderProps;

  get id() {
    return this.props.id;
  }
  get type() {
    return this.props.type;
  }
  get unitValue() {
    return this.props.unitValue;
  }
  get quantity() {
    return this.props.quantity;
  }
  get status() {
    return this.props.status;
  }
  get createdAtTimestamp() {
    return this.props.createdAtTimestamp;
  }
  get expirationType() {
    return this.props.expirationType;
  }
  get expirationTimestamp() {
    return this.props.expirationTimestamp;
  }

  public partiallyExecute(quantity: number) {
    this.props.quantity -= quantity;
    this.props.status = OrderStatusEnum.PartiallyFilled;
  }
}
