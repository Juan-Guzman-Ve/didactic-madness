export abstract class BaseEntity {
  id!: number;
}

export abstract class AuditableEntity extends BaseEntity {
  createdAt!: Date;
  updatedAt!: Date;
  createdBy?: string;
  updatedBy?: string;
}
