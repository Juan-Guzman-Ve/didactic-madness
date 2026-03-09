import { Entity, Column, OneToMany } from 'typeorm';
import { AuditableEntity } from './base';
import { ProductImageEntity } from './product-image.entity';

@Entity('products')
export class ProductEntity extends AuditableEntity {
  @Column({ unique: true })
  sku!: string;

  @Column({ name: 'category_id' })
  categoryId!: string;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column()
  brand!: string;

  @Column({ nullable: true })
  model!: string;

  @Column('integer')
  price!: number;

  @Column('integer')
  stock!: number;

  @Column('jsonb', { nullable: true })
  specifications!: Record<string, any>;

  @Column({ default: 'Active' })
  status!: string;

  @OneToMany(() => ProductImageEntity, (image) => image.product)
  images!: ProductImageEntity[];
}
