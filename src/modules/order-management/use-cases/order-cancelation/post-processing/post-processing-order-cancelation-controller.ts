import TYPES from '@src/core/types';
import { PostProcessingOrderCancelationUseCase } from './post-processing-order-cancelation';
import { inject, injectable } from 'inversify/lib/inversify';
import { QueueController } from '@src/core/infra/queue-controller';
import { PostProcessingOrderCancelationMessage } from './post-processing-order-cancelation-message';

@injectable()
export class PostProcessingOrderCancelationController extends QueueController<PostProcessingOrderCancelationMessage> {
  messageType = PostProcessingOrderCancelationMessage;

  constructor(
    @inject(TYPES.PostProcessingOrderCancelationUseCase)
    private readonly postProcessingOrderCancelationUseCase: PostProcessingOrderCancelationUseCase,
  ) {
    super();
  }

  async perform(message: PostProcessingOrderCancelationMessage): Promise<void> {
    const { orderId } = message;

    await this.postProcessingOrderCancelationUseCase.execute({
      orderId,
    });
  }
}
