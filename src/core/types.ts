const TYPES = {
  // Resources
  DynamoDBClient: Symbol.for('DynamoDBClient'),
  S3Client: Symbol.for('S3Client'),
  SNSClient: Symbol.for('SNSClient'),
  SQSClient: Symbol.for('SQSClient'),
  CognitoIdentityProvider: Symbol.for('CognitoIdentityProvider'),
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  IStorageService: Symbol.for('IStorageService'),
  // Repos
  IOrderCommandRepository: Symbol.for('IOrderCommandRepository'),
  IOrderQueryRepository: Symbol.for('IOrderQueryRepository'),

  IEventNotifier: Symbol.for('IEventNotifier'),

  IQueueClient: Symbol.for('IQueueClient'),
  // UseCases
  SignUpUseCase: Symbol.for('SignUpUseCase'),
  SignUpConfirmUseCase: Symbol.for('SignUpConfirmUseCase'),
  SignUpResendVerificationCodeUseCase: Symbol.for('SignUpResendVerificationCodeUseCase'),
  LogInUseCase: Symbol.for('LogInUseCase'),

  OrderCancelationUseCase: Symbol.for('OrderCancelationUseCase'),
  OrderRegistrationUseCase: Symbol.for('OrderRegistrationUseCase'),
  OrderListUseCase: Symbol.for('OrderListUseCase'),

  // Misc
  Engine: Symbol.for('Engine'),
  OrderBook: Symbol.for('OrderBook'),
};

export default TYPES;
