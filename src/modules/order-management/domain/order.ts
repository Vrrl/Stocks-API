import { AggregateRoot } from '@src/core/domain/aggregate-root';
import { OrderStatusEnum } from './order-status-enum';
import { OrderTypeEnum } from './order-type-enum';
import { OrderExpirationTypeEnum } from './order-expiration-type-enum';
import { FinantialNumber } from '@src/core/domain/shared/finantial-number';
import { exhaustiveGuard } from '@src/core/utils/exhaustiveGuard';
import { isBefore, isSameDay } from 'date-fns';
import { CoreErrors } from '@src/core/errors';

interface OrderProps {
  shareholderId: string;
  status: OrderStatusEnum;
  type: OrderTypeEnum;
  unitValue: FinantialNumber;
  shares: number;
  expirationType: OrderExpirationTypeEnum;
  expirationDate: Date | null;
  createdAtDate: Date;
  filledAtDate: Date | null;
  hasPendingEdition: boolean;
  hasPendingCancelation: boolean;
}

export class Order extends AggregateRoot<OrderProps> {
  private constructor(props: OrderProps, id?: string) {
    super(props, id);

    this.validateSelfExpirationCoherence();
    this.validateSelfDatesCorrelation();
  }

  get expirationTimestamp(): number | null {
    return this.props.expirationDate?.getTime() || null;
  }

  get createdAtTimestamp(): number {
    return this.props.createdAtDate.getTime();
  }

  static ClassErrors = {
    InvalidPropsError: {
      ExpirationCoherence: {
        ORDER_WITHOUT_EXPIRATION_DATE: 'Orders with this type of expirationType need to have an expirationDate value',
        ORDER_WITH_EXPIRATION_DATE: 'Orders with this type of expirationType must not have an expirationDate value',
        DAY_ORDER_NOT_IN_SAME_DAY:
          'Order with expirationType DayOrder must have an expirationDate in the same day of creation',
      },
      ExpirationCorrelation: {
        EXPIRATION_DATE_BEFORE_CREATION: 'the provided expirationDate is before Order creation date',
        FILLED_DATE_BEFORE_CREATION: 'the provided filledAtDate is before Order creation date',
        FILLED_DATE_BEFORE_EXPIRATION_DATE: 'the provided filledAtDate is before Order expirationDate',
      },
    },
    UseCaseError: {
      Cancelation: {
        INVALID_PENDING_STATE: 'Order has an invalid pending state for cancelation confirmation',
      },
      Edition: {
        INVALID_PENDING_STATE: 'Order has an invalid pending state for edition confirmation',
      },
    },
  };

  private validateSelfDatesCorrelation() {
    const { expirationDate, createdAtDate, filledAtDate } = this.props;

    if (expirationDate && isBefore(expirationDate, createdAtDate)) {
      throw new CoreErrors.InvalidPropsError(
        Order.ClassErrors.InvalidPropsError.ExpirationCorrelation.EXPIRATION_DATE_BEFORE_CREATION,
      );
    }
    if (filledAtDate && isBefore(filledAtDate, createdAtDate)) {
      throw new CoreErrors.InvalidPropsError(
        Order.ClassErrors.InvalidPropsError.ExpirationCorrelation.FILLED_DATE_BEFORE_CREATION,
      );
    }
    if (filledAtDate && expirationDate && isBefore(expirationDate, filledAtDate)) {
      throw new CoreErrors.InvalidPropsError(
        Order.ClassErrors.InvalidPropsError.ExpirationCorrelation.FILLED_DATE_BEFORE_EXPIRATION_DATE,
      );
    }
  }

  private validateSelfExpirationCoherence() {
    const { expirationType, expirationDate, createdAtDate } = this.props;

    switch (expirationType) {
      case OrderExpirationTypeEnum.DayOrder:
        if (!expirationDate) {
          throw new CoreErrors.InvalidPropsError(
            Order.ClassErrors.InvalidPropsError.ExpirationCoherence.ORDER_WITHOUT_EXPIRATION_DATE,
          );
        }
        if (!isSameDay(createdAtDate, expirationDate)) {
          throw new CoreErrors.InvalidPropsError(
            Order.ClassErrors.InvalidPropsError.ExpirationCoherence.DAY_ORDER_NOT_IN_SAME_DAY,
          );
        }
        break;
      case OrderExpirationTypeEnum.GoodTillDate:
        if (!expirationDate) {
          throw new CoreErrors.InvalidPropsError(
            Order.ClassErrors.InvalidPropsError.ExpirationCoherence.ORDER_WITHOUT_EXPIRATION_DATE,
          );
        }
        break;
      // case OrderExpirationTypeEnum.AllOrNone:
      //   break;
      case OrderExpirationTypeEnum.FillOrKill:
        break;
      case OrderExpirationTypeEnum.GoodTillCancelled:
        if (expirationDate) {
          throw new CoreErrors.InvalidPropsError(
            Order.ClassErrors.InvalidPropsError.ExpirationCoherence.ORDER_WITH_EXPIRATION_DATE,
          );
        }
        break;
      default:
        exhaustiveGuard(expirationType);
    }
  }

  static createFromPrimitive(
    props: {
      shareholderId: string;
      status: OrderStatusEnum;
      type: OrderTypeEnum;
      unitValue: number;
      shares: number;
      expirationType: OrderExpirationTypeEnum;
      expirationDate?: string | null;
      createdAtDate: string;
      filledAtDate?: string | null;
      hasPendingEdition?: boolean;
      hasPendingCancelation?: boolean;
    },
    id?: string,
  ) {
    return new Order(
      {
        shareholderId: props.shareholderId,
        status: props.status,
        type: props.type,
        unitValue: FinantialNumber.create({ value: props.unitValue }),
        shares: props.shares,
        expirationType: props.expirationType,
        expirationDate: !props.expirationDate ? null : new Date(props.expirationDate),
        createdAtDate: new Date(props.createdAtDate),
        filledAtDate: !props.filledAtDate ? null : new Date(props.filledAtDate),
        hasPendingEdition: props.hasPendingEdition ?? false,
        hasPendingCancelation: props.hasPendingCancelation ?? false,
      },
      id,
    );
  }

  markAsExpired() {
    this.props.status = OrderStatusEnum.Expired;

    return this;
  }

  markAsFilled(filledType: OrderStatusEnum.PartiallyFilled | OrderStatusEnum.Filled) {
    this.props.status = filledType;

    return this;
  }

  markAsPendingCancelation() {
    this.props.hasPendingCancelation = true;

    return this;
  }

  confirmPendingCancelation() {
    if (!this.props.hasPendingCancelation) {
      throw new CoreErrors.UseCaseError(Order.ClassErrors.UseCaseError.Cancelation.INVALID_PENDING_STATE);
    }

    this.props.hasPendingCancelation = false;
    this.props.status = OrderStatusEnum.Canceled;

    return this;
  }

  markAsPendingEdition() {
    this.props.hasPendingEdition = true;

    return this;
  }

  confirmPendingEdition() {
    if (!this.props.hasPendingEdition) {
      throw new CoreErrors.UseCaseError(Order.ClassErrors.UseCaseError.Edition.INVALID_PENDING_STATE);
    }

    this.props.hasPendingEdition = false;

    return this;
  }

  updateExpirationDate(expirationDate: Date | null) {
    this.props.expirationDate = expirationDate;
    this.validateSelfExpirationCoherence();
    this.validateSelfDatesCorrelation();

    return this;
  }

  updateExpirationType(expirationType: OrderExpirationTypeEnum, expirationDate?: null | Date) {
    this.props.expirationType = expirationType;
    if (expirationDate !== undefined) {
      this.props.expirationDate = expirationDate;
    }
    this.validateSelfExpirationCoherence();
    this.validateSelfDatesCorrelation();

    return this;
  }

  updateShares(shares: number) {
    this.props.shares = shares;
    this.validateSelfExpirationCoherence();
    this.validateSelfDatesCorrelation();

    return this;
  }

  updateUnitValue(unitValue: FinantialNumber) {
    this.props.unitValue = unitValue;
    this.validateSelfExpirationCoherence();
    this.validateSelfDatesCorrelation();

    return this;
  }

  copy(): Order {
    return new Order(
      {
        ...this.props,
      },
      this.id,
    );
  }

  public toJson() {
    return {
      id: this.id,
      shareholderId: this.props.shareholderId,
      status: this.props.status,
      type: this.props.type,
      unitValue: this.props.unitValue.value,
      shares: this.props.shares,
      expirationType: this.props.expirationType,
      expirationDate: this.props.expirationDate ? this.props.expirationDate.toISOString() : null,
      expirationTimestamp: this.expirationTimestamp,
      createdAtDate: this.props.createdAtDate.toISOString(),
      createdAtTimestamp: this.createdAtTimestamp,
      filledAtDate: this.props.filledAtDate,
      hasPendingEdition: this.props.hasPendingEdition,
      hasPendingCancelation: this.props.hasPendingCancelation,
    };
  }
}
