import { Injectable } from '@nestjs/common';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.transaction.findMany({
      include: {
        sales: {
          include: { product: true },
        },
      },
    });
  }

  findAllInventoryTransactions() {
    return this.prisma.inventoryTransaction.findMany({
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findAllByDay(dateSelected: string) {
    const date = dateSelected ? dayjs(dateSelected) : dayjs();
    const start = date.startOf('day').toDate();
    const end = date.endOf('day').toDate();

    return this.prisma.transaction.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: {
        sales: {
          include: { product: true },
        },
      },
    });
  }

  async getMonthlySales(year: number, month: number) {
    const startOfMonth = dayjs()
      .year(year)
      .month(month - 1)
      .startOf('month')
      .toDate();
    const endOfMonth = dayjs()
      .year(year)
      .month(month - 1)
      .endOf('month')
      .toDate();

    const result = await this.prisma.transaction.aggregate({
      _sum: {
        total: true,
      },
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return {
      year,
      month,
      totalSales: result._sum.total || 0,
    };
  }

  findAllByYesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return this.prisma.transaction.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: {
        sales: {
          include: { product: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id: id },
      include: {
        sales: {
          include: { product: true },
        },
        employee: true,
      },
    });
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id: id },
      data: updateTransactionDto,
    });
  }

  remove(id: string) {
    return this.prisma.transaction.delete({
      where: { id: id },
    });
  }
}
