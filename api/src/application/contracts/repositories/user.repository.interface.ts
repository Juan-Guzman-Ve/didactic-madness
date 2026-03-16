import { User } from '@app/domain';
import { IRepository } from '@app/application';

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}
