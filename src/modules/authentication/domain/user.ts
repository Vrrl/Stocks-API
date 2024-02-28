import { Entity } from '@src/core/domain/entity';

export interface UserProps {
  /**
   * @atribute Id in the auth provider
   */
  externalId: string;
  /**
   * @atribute name self attributed by the user
   */
  username: string;
  email: string;
  emailVerified: boolean;
}

export class User extends Entity<UserProps> {
  toJson() {
    return {
      id: this._id,
      externalId: this.props.externalId,
      username: this.props.username,
      email: this.props.email,
      emailVerified: this.props.emailVerified,
    };
  }
}
