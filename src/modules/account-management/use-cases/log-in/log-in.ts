import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { IAuthenticationService } from '@src/infra/authentication/services/authentication-service';
import { IOAuthToken } from '../../../../infra/authentication/dtos/oauth-token';
import TYPES from '@src/infra/types';

interface LogInRequest {
  username: string;
  password: string;
}

type LogInResponse = { oauthToken: IOAuthToken; user: object };

@injectable()
export class LogInUseCase implements IUseCase<LogInRequest, LogInResponse> {
  constructor(@inject(TYPES.IAuthenticationService) private readonly authenticationService: IAuthenticationService) {}

  async execute({ username, password }: LogInRequest): Promise<LogInResponse> {
    const oauthToken = await this.authenticationService.logIn(username, password);
    const user = await this.authenticationService.getUserByToken(`Bearer ${oauthToken.accessToken}`);
    if (!user) throw new Error('user not found');
    return { oauthToken, user: user.toJson() };
  }
}
