import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { CoreErrors } from '@src/core/errors';
import { IOrderQueryRepository } from '@src/modules/order-management/infra/db/order-query-repository';
import { IOrderCommandRepository } from '@src/modules/order-management/infra/db/order-command-repository';
import { PostProcessingOrderEditionMessage } from './post-processing-order-edition-message';
import { FinantialNumber } from '@src/core/domain/shared/finantial-number';

interface PostProcessingOrderEditionRequest extends PostProcessingOrderEditionMessage {}

type PostProcessingOrderEditionResponse = void;

@injectable()
export class PostProcessingOrderEditionUseCase
  implements IUseCase<PostProcessingOrderEditionRequest, PostProcessingOrderEditionResponse>
{
  constructor(
    @inject(TYPES.IOrderQueryRepository)
    private readonly orderQueryRepository: IOrderQueryRepository,
    @inject(TYPES.IOrderCommandRepository)
    private readonly orderCommandRepository: IOrderCommandRepository,
  ) {}

  async execute({
    orderId,
    unitValue,
    shares,
    expirationType,
    expirationTimestamp,
  }: PostProcessingOrderEditionRequest): Promise<PostProcessingOrderEditionResponse> {
    const targetOrder = await this.orderQueryRepository.getById(orderId);

    if (!targetOrder) {
      throw new CoreErrors.ValidationError(
        PostProcessingOrderEditionUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_NOT_FOUND,
      );
    }

    targetOrder.updateUnitValue(FinantialNumber.create({ value: unitValue }));
    targetOrder.updateShares(shares);
    targetOrder.updateExpirationType(
      expirationType,
      expirationTimestamp !== null && expirationTimestamp !== undefined
        ? new Date(expirationTimestamp)
        : expirationTimestamp,
    );
    targetOrder.updateExpirationDate(
      expirationTimestamp === null ? expirationTimestamp : new Date(expirationTimestamp),
    );
    targetOrder.confirmPendingEdition();

    await this.orderCommandRepository.save(targetOrder);
  }

  static ClassErrors = {
    UseCaseError: {
      TargetOrder: {
        ORDER_NOT_FOUND: 'The specified order was not found.',
      },
    },
  };
}
