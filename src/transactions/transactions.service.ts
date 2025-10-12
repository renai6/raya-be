import { Injectable } from '@nestjs/common';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'prisma/prisma.service';

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
  findAllByDay() {
    const date = new Date();
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
