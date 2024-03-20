const TYPES = {
  // Resources
  DynamoDBClient: Symbol.for('DynamoDBClient'),
  S3Client: Symbol.for('S3Client'),
  SNSClient: Symbol.for('SNSClient'),
  CognitoIdentityProvider: Symbol.for('CognitoIdentityProvider'),
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  IStorageService: Symbol.for('IStorageService'),
  // Repos
  IOrderCommandRepository: Symbol.for('IOrderCommandRepository'),

  IEventNotifier: Symbol.for('IEventNotifier'),
  // UseCases
  SignUpUseCase: Symbol.for('SignUpUseCase'),
  SignUpConfirmUseCase: Symbol.for('SignUpConfirmUseCase'),
  SignUpResendVerificationCodeUseCase: Symbol.for('SignUpResendVerificationCodeUseCase'),
  LogInUseCase: Symbol.for('LogInUseCase'),
  OrderRegistrationUseCase: Symbol.for('OrderRegistrationUseCase'),
};

export default TYPES;
