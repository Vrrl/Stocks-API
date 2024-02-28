import { Entity } from '@src/core/domain/entity';

export interface UserProps {
  externalId: string;
  username: string;
  email: string;
  emailVerified: boolean;
  imageUrl?: string;
}

export class User extends Entity<UserProps> {
  toJson() {
    return {
      id: this._id,
      externalId: this.props.externalId,
      username: this.props.username,
      email: this.props.email,
      emailVerified: this.props.emailVerified,
      imageUrl: this.props.imageUrl,
    };
  }
}
