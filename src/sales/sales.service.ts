import { Injectable, Logger } from '@nestjs/common';
import { CreateSaleDto, CreateTransactionDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PrismaService } from 'prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    let transaction;

    if (createTransactionDto.employeeBarcode) {
      const employee = await this.prisma.employee.findUnique({
        where: { employeeNumber: createTransactionDto.employeeBarcode },
      });

      transaction = await this.prisma.transaction.create({
        data: {
          cashSessionId: createTransactionDto.cashSessionId,
          cashReceived: createTransactionDto.cashReceived,
          paymentType: createTransactionDto.paymentType,
          employeeNumber: createTransactionDto.employeeBarcode || null,
          employeeId: employee?.id || null,
          total: createTransactionDto.sales.reduce(
            (acc, item) => acc + item.selectedPrice * item.quantity,
            0,
          ),
        },
      });
    } else {
      transaction = await this.prisma.transaction.create({
        data: {
          cashSessionId: createTransactionDto.cashSessionId,
          cashReceived: createTransactionDto.cashReceived,
          paymentType: createTransactionDto.paymentType,
          employeeNumber: null,
          total: createTransactionDto.sales.reduce(
            (acc, item) => acc + item.selectedPrice * item.quantity,
            0,
          ),
        },
      });
    }

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

  findAllDated(startDate: string, endDate: string) {
    const start = startDate
      ? dayjs.tz(`${startDate} 00:00`, 'YYYY-MM-DD HH:mm', 'Asia/Manila')
      : dayjs().tz('Asia/Manila').startOf('day');

    const end = endDate
      ? dayjs.tz(`${endDate} 23:59`, 'YYYY-MM-DD HH:mm', 'Asia/Manila')
      : dayjs().tz('Asia/Manila').endOf('day');

    return this.prisma.sale.findMany({
      where: {
        createdAt: {
          gte: start.toDate(),
          lte: end.toDate(),
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
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
