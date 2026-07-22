import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, CreateProductDto } from './dto/create-product.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      id: uuidv4(),
      ...createProductDto,
    };
    this.products.push(newProduct);
    return newProduct;
  }
}