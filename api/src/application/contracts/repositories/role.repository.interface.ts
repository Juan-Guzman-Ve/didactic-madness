import { Role } from '@app/domain';
import { IRepository } from '@app/application';

export interface IRoleRepository extends IRepository<Role> {
  findByName(name: string): Promise<Role | null>;
}
