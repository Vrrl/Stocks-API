import { HttpRequest, HttpResponse } from '@core/infra/http';
import * as httpStatus from './helpers/http-status';
import { z } from 'zod';
import { injectable } from 'inversify';
import { AuthenticationLevel } from './authentication/authentication-level';
import { IAuthenticationService } from '@src/infra/authentication/services/authentication-service';
import { User } from '@src/infra/authentication/domain/user';
import container from '@src/modules/account-management/infra/injector';
import { UseCaseError, ValidationError } from '../errors';
import TYPES from '@src/infra/types';

export type HttpControllerContext = { user?: User };

@injectable()
export abstract class HttpController {
  protected authenticationService: IAuthenticationService;

  authenticationLevels?: AuthenticationLevel[];

  constructor() {
    this.authenticationService = container.get<IAuthenticationService>(TYPES.IAuthenticationService);
  }

  abstract get requestSchema(): z.AnyZodObject | undefined;
  abstract perform(httpRequest: HttpRequest, context?: HttpControllerContext): Promise<HttpResponse>;

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const context: HttpControllerContext = {};

      if (this.authenticationLevels?.length) {
        if (process.env.NODE_ENV === 'local') {
          context.user = new User(
            { email: 'local@local.com', emailVerified: true, externalId: '000000', username: 'localuser' },
            '000000',
          );
        } else {
          try {
            const user = await this.authenticationService.getUserByToken(httpRequest.headers?.authorization);
            if (!user) return httpStatus.Unauthorized();
            context.user = user;
          } catch (error: any) {
            if (error.name === 'NotAuthorizedException') return httpStatus.Unauthorized('Access Token has expired');
            console.log(error);
            return httpStatus.serverError();
          }
        }
      }

      if (this.requestSchema) {
        const validator = await this.requestSchema.safeParseAsync(httpRequest);

        if (!validator.success) return httpStatus.badRequest(validator.error.issues);
      }

      return await this.perform(httpRequest, context);
    } catch (error) {
      if (error instanceof ValidationError || error instanceof UseCaseError) {
        return {
          statusCode: error.statusCode,
          body: { message: error.message },
        };
      }

      console.log(error);
      return httpStatus.serverError();
    }
  }
}
