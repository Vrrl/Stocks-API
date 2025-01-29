const TYPES = {
  // Resources
  DynamoDBClient: Symbol.for('DynamoDBClient'),
  SNSClient: Symbol.for('SNSClient'),
  SQSClient: Symbol.for('SQSClient'),
  // Services
  // Repos
  IOrderCommandRepository: Symbol.for('IOrderCommandRepository'),
  IOrderQueryRepository: Symbol.for('IOrderQueryRepository'),

  IEventNotifier: Symbol.for('IEventNotifier'),

  IQueueClient: Symbol.for('IQueueClient'),
  // UseCases
  OrderCancelationUseCase: Symbol.for('OrderCancelationUseCase'),
  PostProcessingOrderCancelationUseCase: Symbol.for('PostProcessingOrderCancelationUseCase'),
  PostProcessingOrderEditionUseCase: Symbol.for('PostProcessingOrderEditionUseCase'),
  PostProcessingOrderExecutedUseCase: Symbol.for('PostProcessingOrderExecutedUseCase'),
  PostProcessingOrderExpiredUseCase: Symbol.for('PostProcessingOrderExpiredUseCase'),
  OrderEditionUseCase: Symbol.for('OrderEditUseCase'),
  OrderRegistrationUseCase: Symbol.for('OrderRegistrationUseCase'),
  OrderListUseCase: Symbol.for('OrderListUseCase'),
};

export default TYPES;
