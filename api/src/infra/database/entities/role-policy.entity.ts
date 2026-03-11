import { Entity, Column, Unique } from 'typeorm';
import { AuditableEntity } from './base';

@Entity('role_policies')
@Unique(['roleId', 'policyId'])
export class RolePolicyEntity extends AuditableEntity {
  @Column({ name: 'role_id' })
  roleId!: string;

  @Column({ name: 'policy_id' })
  policyId!: string;
}
