import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  async findAll() {
    // TODO: Implement get all categories
    throw new Error('Not implemented');
  }

  async findOne(id: string) {
    // TODO: Implement get category by ID
    throw new Error('Not implemented');
  }

  async create(name: string, description: string, slug: string) {
    // TODO: Implement create category
    throw new Error('Not implemented');
  }

  async update(id: string, data: any) {
    // TODO: Implement update category
    throw new Error('Not implemented');
  }

  async remove(id: string) {
    // TODO: Implement delete category
    throw new Error('Not implemented');
  }
}
