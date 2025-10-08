import { IsString, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  retailPrice: number;

  @IsNumber()
  @Min(0)
  wholesalePrice: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  barcode: string;
}
