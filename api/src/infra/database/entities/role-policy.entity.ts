import { Entity, Column, Unique } from 'typeorm';
import { AuditableEntity } from './base';

@Entity('role_policies')
@Unique(['roleId', 'policyId'])
export class RolePolicyEntity extends AuditableEntity {
  @Column({ name: 'role_id', type: 'integer' })
  roleId!: number;

  @Column({ name: 'policy_id', type: 'integer' })
  policyId!: number;
}
