export class ProductResponseDto {
  id: string;
  sku: string;
  categoryId: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  specifications: Record<string, any>;
  status: string;
  images: ProductImageDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class ProductImageDto {
  id: string;
  url: string;
  displayOrder: number;
}
