import { User } from '@src/infra/authentication/domain/user';
import { IOAuthToken } from '../dtos/oauth-token';

export interface IAuthenticationService {
  getUserByToken(token: string): Promise<User | undefined>;
  signUp(email: string, username: string, password: string, internalId: string): Promise<void>;
  signUpConfirm(username: string, confirmationCode: string): Promise<void>;
  signUpResendVerificationCode(username: string): Promise<void>;
  logIn(username: string, password: string): Promise<IOAuthToken>;
  listUsers(): Promise<User[]>;
}
