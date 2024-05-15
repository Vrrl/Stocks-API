const TYPES = {
  // Resources
  DynamoDBClient: Symbol.for('DynamoDBClient'),
  S3Client: Symbol.for('S3Client'),
  SNSClient: Symbol.for('SNSClient'),
  CognitoIdentityProvider: Symbol.for('CognitoIdentityProvider'),
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  // Repos
  IOrderCommandRepository: Symbol.for('IOrderCommandRepository'),
  IOrderQueryRepository: Symbol.for('IOrderQueryRepository'),

  // UseCases
  SignUpUseCase: Symbol.for('SignUpUseCase'),
  SignUpConfirmUseCase: Symbol.for('SignUpConfirmUseCase'),
  SignUpResendVerificationCodeUseCase: Symbol.for('SignUpResendVerificationCodeUseCase'),
  LogInUseCase: Symbol.for('LogInUseCase'),
};

export default TYPES;
