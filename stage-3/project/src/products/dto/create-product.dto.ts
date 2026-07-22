import { IsString, IsNumber, IsPositive, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
}