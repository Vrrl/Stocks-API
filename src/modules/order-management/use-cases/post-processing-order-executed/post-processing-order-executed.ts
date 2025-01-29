import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { CoreErrors } from '@src/core/errors';
import { IOrderQueryRepository } from '@src/modules/order-management/infra/db/order-query-repository';
import { IOrderCommandRepository } from '@src/modules/order-management/infra/db/order-command-repository';
import { PostProcessingOrderExecutedMessage } from './post-processing-order-executed-message';
import TYPES from '@src/modules/order-management/infra/types';
import { OrderStatusEnum } from '../../domain/order-status-enum';

interface PostProcessingOrderExecutedRequest extends PostProcessingOrderExecutedMessage {}

type PostProcessingOrderExecutedResponse = void;

@injectable()
export class PostProcessingOrderExecutedUseCase
  implements IUseCase<PostProcessingOrderExecutedRequest, PostProcessingOrderExecutedResponse>
{
  constructor(
    @inject(TYPES.IOrderQueryRepository)
    private readonly orderQueryRepository: IOrderQueryRepository,
    @inject(TYPES.IOrderCommandRepository)
    private readonly orderCommandRepository: IOrderCommandRepository,
  ) {}

  async execute({
    id,
    currentStatus,
  }: PostProcessingOrderExecutedRequest): Promise<PostProcessingOrderExecutedResponse> {
    const targetOrder = await this.orderQueryRepository.getById(id);

    if (!targetOrder) {
      throw new CoreErrors.ValidationError(
        PostProcessingOrderExecutedUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_NOT_FOUND,
      );
    }

    if (currentStatus !== OrderStatusEnum.PartiallyFilled && currentStatus !== OrderStatusEnum.Filled) {
      throw new CoreErrors.ValidationError(
        PostProcessingOrderExecutedUseCase.ClassErrors.UseCaseError.currentStatus.ORDER_STATUS_NOT_ELEGIBLE,
      );
    }

    targetOrder.markAsFilled(currentStatus);

    await this.orderCommandRepository.save(targetOrder);
  }

  static ClassErrors = {
    UseCaseError: {
      TargetOrder: {
        ORDER_NOT_FOUND: 'The specified order was not found.',
      },
      currentStatus: {
        ORDER_STATUS_NOT_ELEGIBLE:
          'The specified order has an not elegible status for editing. Elegible status: OrderStatusEnum.Pending, OrderStatusEnum.PartiallyFilled.',
      },
    },
  };
}
