import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';

export enum SaleType {
  RETAIL = 'RETAIL',
  WHOLESALE = 'WHOLESALE',
}

export enum PaymentType {
  CASH = 'CASH',
  CREDIT = 'CREDIT',
}

export class CreateSaleDto {
  @IsInt()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  selectedPrice: number;

  @IsEnum(SaleType)
  saleType: SaleType;
}

export class CreateTransactionDto {
  @IsInt()
  cashReceived: number;
  @IsEnum(PaymentType)
  paymentType: PaymentType;
  employeeBarcode: string;
  sales: CreateSaleDto[];
}
