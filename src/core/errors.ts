export class InvalidPropsError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidPropsError.prototype);
  }
}

export class UseCaseError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, UseCaseError.prototype);
  }
}

export class ValidationError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 422) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, UseCaseError.prototype);
  }
}

export class InfrastructureError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InfrastructureError.prototype);
  }
}

export const CoreErrors = { InfrastructureError, UseCaseError, InvalidPropsError, ValidationError };
