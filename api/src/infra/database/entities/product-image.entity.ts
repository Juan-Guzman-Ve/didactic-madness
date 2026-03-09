import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from './base';
import { ProductEntity } from './product.entity';

@Entity('product_images')
export class ProductImageEntity extends AuditableEntity {
  @Column({ name: 'product_id' })
  productId!: string;

  @Column()
  url!: string;

  @Column({ name: 'display_order', default: 0 })
  displayOrder!: number;

  @ManyToOne(() => ProductEntity, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;
}
