import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import type { Product } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(): Product[] {
    return this.productsService.findAll();
  }

  @Get(':id')
  getProductById(@Param('id') id: string): Product {
    return this.productsService.findOne(id);
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto): Product {
    return this.productsService.create(createProductDto);
  }
}