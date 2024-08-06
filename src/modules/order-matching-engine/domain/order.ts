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
  shares: number;
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
    throwIfNotNumber(props.shares, 'Invalid parameter shares in Order Class');
    throwIfUndefinedOrNotEnum(props.status, OrderStatusEnum, 'Invalid parameter status in Order Class');
    throwIfUndefinedOrNotEnum(
      props.expirationType,
      OrderExpirationTypeEnum,
      'An valid parameter expirationType is required in Order Class',
    );

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
  get shares() {
    return this.props.shares;
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
  get totalValue() {
    return this.unitValue * this.shares;
  }

  public partiallyExecute(shares: number) {
    this.props.shares -= shares;
    this.props.status = OrderStatusEnum.PartiallyFilled;
  }

  public cancel() {
    this.props.status = OrderStatusEnum.Canceled;
  }

  public expire() {
    this.props.status = OrderStatusEnum.Expired;
  }
}
