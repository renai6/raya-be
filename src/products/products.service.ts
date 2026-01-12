import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { CreateBulkProductDto } from './dto/create-bulk-product.dto';

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

  async createBulk(createBulkProductDto: CreateBulkProductDto) {
    const barcodes = createBulkProductDto.products.map((p) => p.barcode);

    const existingBarcodes = await this.prisma.product.findMany({
      where: { barcode: { in: barcodes } },
    });

    const existingBarcodeMap = new Map(
      existingBarcodes.map((p) => [p.barcode, p]),
    );

    for (const product of createBulkProductDto.products) {
      const existingProduct = existingBarcodeMap.get(product.barcode);

      const productData = await this.prisma.product.upsert({
        where: { barcode: product.barcode },
        create: product,
        update: {
          ...product,
          retailPrice: existingProduct
            ? createBulkProductDto.isPriceExe
              ? product.retailPrice
              : existingProduct.retailPrice
            : product.retailPrice,
          stock: existingProduct
            ? existingProduct.stock + product.stock
            : product.stock,
        },
      });

      await this.prisma.inventoryTransaction.create({
        data: {
          type: existingProduct ? 'ADJUSTMENT' : 'PURCHASE',
          productId: productData.id,
          oldQuantity: existingProduct ? existingProduct.stock : 0,
          newQuantity: existingProduct
            ? existingProduct.stock + product.stock
            : product.stock,
          oldRetailPrice: existingProduct
            ? existingProduct.retailPrice
            : product.retailPrice,
          newRetailPrice: existingProduct
            ? createBulkProductDto.isPriceExe
              ? product.retailPrice
              : existingProduct.retailPrice
            : product.retailPrice,
          oldWholesalePrice: 0,
          newWholesalePrice: 0,
          reason: existingProduct ? 'Update stock' : 'Initial stock',
        },
      });
    }

    return { inserted: createBulkProductDto.products.length };
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        sales: true,
      },
      orderBy: { name: 'asc' },
    });

    const count = await this.prisma.product.count();

    return { products, count };
  }

  async findLowStocks() {
    const products = await this.prisma.product.findMany({
      where: { stock: { lt: 10 }, isDeleted: false },
    });

    return products;
  }

  async findProductSales() {
    const products = await this.prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        sales: true,
      },
      orderBy: {
        sales: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    return products;
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id, isDeleted: false } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id, isDeleted: false },
    });
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
    return this.prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async generateReport() {
    return this.prisma.product.findMany({
      where: { isDeleted: false },
      select: {
        name: true,
        barcode: true,
        stock: true,
        retailPrice: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
