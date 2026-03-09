export interface ProductResponseDto {
  id: string;
  sku: string;
  categoryId: string;
  name: string;
  description: string;
  brand: string;
  model?: string;
  price: number;
  stock: number;
  specifications?: Record<string, any>;
  status: string;
  images?: Array<{
    id: string;
    url: string;
    displayOrder: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
