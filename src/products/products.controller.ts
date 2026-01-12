import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ActiveSessionGuard } from 'src/auth/active-session-guard';
import { CreateBulkProductDto } from './dto/create-bulk-product.dto';

@UseGuards(JwtAuthGuard, RolesGuard, ActiveSessionGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('bulk')
  createBulk(@Body() createBulkProductDto: CreateBulkProductDto) {
    return this.productsService.createBulk(createBulkProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('low-stocks')
  findLowStocks() {
    return this.productsService.findLowStocks();
  }

  @Get('sales')
  findProductSales() {
    return this.productsService.findProductSales();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('reports/data')
  async reports() {
    return this.productsService.generateReport();
  }
}
