import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { CoreErrors } from '@src/core/errors';
import { IOrderQueryRepository } from '@src/modules/order-management/infra/db/order-query-repository';
import { IOrderCommandRepository } from '@src/modules/order-management/infra/db/order-command-repository';
import { PostProcessingOrderExpiredMessage } from './post-processing-order-expired-message';
import TYPES from '@src/modules/order-management/infra/types';

interface PostProcessingOrderExpiredRequest extends PostProcessingOrderExpiredMessage {}

type PostProcessingOrderExpiredResponse = void;

@injectable()
export class PostProcessingOrderExpiredUseCase
  implements IUseCase<PostProcessingOrderExpiredRequest, PostProcessingOrderExpiredResponse>
{
  constructor(
    @inject(TYPES.IOrderQueryRepository)
    private readonly orderQueryRepository: IOrderQueryRepository,
    @inject(TYPES.IOrderCommandRepository)
    private readonly orderCommandRepository: IOrderCommandRepository,
  ) {}

  async execute({ id }: PostProcessingOrderExpiredRequest): Promise<PostProcessingOrderExpiredResponse> {
    const targetOrder = await this.orderQueryRepository.getById(id);

    if (!targetOrder) {
      throw new CoreErrors.ValidationError(
        PostProcessingOrderExpiredUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_NOT_FOUND,
      );
    }

    targetOrder.markAsExpired();

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
