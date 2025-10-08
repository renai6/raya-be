import { Injectable, Logger } from '@nestjs/common';
import { CreateSaleDto, CreateTransactionDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.prisma.transaction.create({
      data: {
        cashReceived: createTransactionDto.cashReceived,
        total: createTransactionDto.sales.reduce(
          (acc, item) => acc + item.selectedPrice * item.quantity,
          0,
        ),
      },
    });

    const newSales = await this.prisma.sale.createMany({
      data: createTransactionDto.sales.map((item) => ({
        productId: item.productId,
        transactionId: transaction.id,
        quantity: item.quantity,
        total: item.selectedPrice,
        saleType: item.saleType,
      })),
    });

    // Update product stocks
    for (const item of createTransactionDto.sales) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (product) {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });
      }
    }

    return { transaction: transaction.id, salesCreated: newSales.count };
  }

  findAll() {
    return this.prisma.sale.findMany();
  }

  findOne(id: string) {
    return this.prisma.sale.findUnique({ where: { id } });
  }

  findOneByTransaction(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        sales: true,
      },
    });
  }

  update(id: string, updateSaleDto: UpdateSaleDto) {
    return this.prisma.sale.update({
      where: { id },
      data: updateSaleDto,
    });
  }

  remove(id: string) {
    return this.prisma.sale.delete({ where: { id } });
  }
}
