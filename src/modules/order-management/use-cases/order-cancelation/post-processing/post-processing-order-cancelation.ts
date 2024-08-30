import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { CoreErrors } from '@src/core/errors';
import { IOrderQueryRepository } from '@src/modules/order-management/infra/db/order-query-repository';
import { IOrderCommandRepository } from '@src/modules/order-management/infra/db/order-command-repository';
import { PostProcessingOrderCancelationMessage } from './post-processing-order-cancelation-message';

interface PostProcessingOrderCancelationRequest extends PostProcessingOrderCancelationMessage {}

type PostProcessingOrderCancelationResponse = void;

@injectable()
export class PostProcessingOrderCancelationUseCase
  implements IUseCase<PostProcessingOrderCancelationRequest, PostProcessingOrderCancelationResponse>
{
  constructor(
    @inject(TYPES.IOrderQueryRepository)
    private readonly orderQueryRepository: IOrderQueryRepository,
    @inject(TYPES.IOrderCommandRepository)
    private readonly orderCommandRepository: IOrderCommandRepository,
  ) {}

  async execute({ orderId }: PostProcessingOrderCancelationRequest): Promise<PostProcessingOrderCancelationResponse> {
    const targetOrder = await this.orderQueryRepository.getById(orderId);

    if (!targetOrder) {
      throw new CoreErrors.ValidationError(
        PostProcessingOrderCancelationUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_NOT_FOUND,
      );
    }

    targetOrder.confirmPendingCancelation();

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
