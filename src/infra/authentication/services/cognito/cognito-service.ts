import { IAuthenticationService } from '../authentication-service';
import TYPES from '@src/core/types';
import {
  CognitoIdentityProvider,
  ConfirmSignUpCommandInput,
  GetUserCommandInput,
  GetUserResponse,
  InitiateAuthCommandInput,
  ListUsersCommandInput,
  ResendConfirmationCodeCommandInput,
  SignUpCommandInput,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { throwIfNotBoolean, throwIfUndefinedOrEmptyString } from '@src/core/infra/helpers/validation';
import { inject, injectable } from 'inversify/lib/inversify';
import { IOAuthToken } from '../../dtos/oauth-token';
import { User } from '@src/infra/authentication/domain/user';

@injectable()
export class CognitoService implements IAuthenticationService {
  USER_POOL_ID: string;
  CLIENT_ID: string;

  constructor(
    @inject(TYPES.CognitoIdentityProvider) private readonly cognitoIdentityProvider: CognitoIdentityProvider,
  ) {
    // Only if variables have been setup already #TODO: remover isso, ja arrumei
    if (process.env.NODE_ENV) {
      this.USER_POOL_ID = throwIfUndefinedOrEmptyString(process.env.COGNITO_USER_POOL_ID);
      this.CLIENT_ID = throwIfUndefinedOrEmptyString(process.env.COGNITO_CLIENT_ID);
    }
  }

  async signUp(email: string, username: string, password: string, internalId: string): Promise<void> {
    const params = {
      UserPoolId: this.USER_POOL_ID,
      ClientId: this.CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'nickname',
          Value: username,
        },
        {
          Name: 'custom:internalId',
          Value: internalId,
        },
      ],
    } as SignUpCommandInput;

    await this.cognitoIdentityProvider.signUp(params);
  }

  async signUpConfirm(username: string, confirmationCode: string): Promise<void> {
    const params = {
      UserPoolId: this.USER_POOL_ID,
      ClientId: this.CLIENT_ID,
      Username: username,
      ConfirmationCode: confirmationCode,
    } as ConfirmSignUpCommandInput;

    await this.cognitoIdentityProvider.confirmSignUp(params);
  }

  async signUpResendVerificationCode(username: string): Promise<void> {
    const params = {
      UserPoolId: this.USER_POOL_ID,
      ClientId: this.CLIENT_ID,
      Username: username,
    } as ResendConfirmationCodeCommandInput;

    await this.cognitoIdentityProvider.resendConfirmationCode(params);
  }

  async logIn(username: string, password: string): Promise<IOAuthToken> {
    const params = {
      UserPoolId: this.USER_POOL_ID,
      ClientId: this.CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    } as InitiateAuthCommandInput;

    const { AuthenticationResult } = await this.cognitoIdentityProvider.initiateAuth(params);

    if (!AuthenticationResult) throw new Error('AuthenticationResult is null. TODO: improve this error type');

    const oauthToken = {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
      expiresIn: AuthenticationResult.ExpiresIn,
      type: AuthenticationResult.TokenType,
    } as IOAuthToken;

    return oauthToken;
  }

  async getUserByToken(token: string): Promise<User | undefined> {
    if (!token) return undefined;

    const [tokenType, accessToken] = token.split(' ');

    if (tokenType === 'Bearer') {
      const params = {
        AccessToken: accessToken,
      } as GetUserCommandInput;

      const res = await this.cognitoIdentityProvider.getUser(params);

      return this.mapFromProvider(res);
    }
  }

  async listUsers(): Promise<User[]> {
    const params = { UserPoolId: this.USER_POOL_ID } as ListUsersCommandInput;
    const res = await this.cognitoIdentityProvider.listUsers(params);

    if (!res.Users) return [];

    return res.Users.map(x => this.mapFromUserType(x));
  }

  private mapFromProvider(userResponse: GetUserResponse): User {
    return new User(
      {
        email: throwIfUndefinedOrEmptyString(userResponse.UserAttributes?.find(x => x.Name === 'email')?.Value),
        emailVerified: throwIfNotBoolean(userResponse.UserAttributes?.find(x => x.Name === 'email_verified')?.Value),
        username: throwIfUndefinedOrEmptyString(userResponse.Username),
        externalId: throwIfUndefinedOrEmptyString(userResponse.UserAttributes?.find(x => x.Name === 'sub')?.Value),
      },
      throwIfUndefinedOrEmptyString(userResponse.UserAttributes?.find(x => x.Name === 'custom:internalId')?.Value),
    );
  }

  private mapFromUserType(user: UserType): User {
    return new User(
      {
        email: throwIfUndefinedOrEmptyString(user.Attributes?.find(x => x.Name === 'email')?.Value),
        emailVerified: throwIfNotBoolean(user.Attributes?.find(x => x.Name === 'email_verified')?.Value),
        username: throwIfUndefinedOrEmptyString(user.Username),
        externalId: throwIfUndefinedOrEmptyString(user.Attributes?.find(x => x.Name === 'sub')?.Value),
      },
      throwIfUndefinedOrEmptyString(user.Attributes?.find(x => x.Name === 'custom:internalId')?.Value),
    );
  }
}
