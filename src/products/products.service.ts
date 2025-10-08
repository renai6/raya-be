import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    await this.prisma.inventoryTransaction.create({
      data: {
        type: 'PURCHASE',
        productId: product.id,
        oldQuantity: 0,
        newQuantity: createProductDto.stock,
        oldRetailPrice: createProductDto.retailPrice,
        newRetailPrice: createProductDto.retailPrice,
        oldWholesalePrice: createProductDto.wholesalePrice,
        newWholesalePrice: createProductDto.wholesalePrice,
        reason: 'Initial stock',
      },
    });

    return product;
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  async findLowStocks() {
    const products = await this.prisma.product.findMany({
      where: { stock: { lt: 10 } },
    });

    return products;
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error('Product not found');
    }

    await this.prisma.inventoryTransaction.create({
      data: {
        type: 'ADJUSTMENT',
        productId: product.id,
        oldQuantity: product.stock,
        newQuantity: updateProductDto?.stock || product.stock,
        oldRetailPrice: product.retailPrice,
        newRetailPrice: updateProductDto?.retailPrice || product.retailPrice,
        oldWholesalePrice: product.wholesalePrice,
        newWholesalePrice:
          updateProductDto?.wholesalePrice || product.wholesalePrice,
        reason: 'Update stock',
      },
    });

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
