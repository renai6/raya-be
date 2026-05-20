import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  async create(createUserDto: CreateUserDto) {
    // Encrypt password if provided
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }

    return this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  async update(id: string, updateUserDto: CreateUserDto) {
    return this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  async createCashSessions(userId: string, openingCash: number) {
    return this.prisma.cashSession.create({
      data: {
        userId,
        openingCash,
        status: 'OPEN',
      },
    });
  }

  async updateCashSessions(
    id: string,
    {
      closingCash,
      borrowedCash,
    }: { closingCash?: number; borrowedCash?: number },
  ) {
    if (closingCash !== undefined) {
      return this.prisma.cashSession.update({
        where: { id },
        data: {
          closingCash,
          status: 'CLOSED',
          closedAt: new Date(),
        },
      });
    } else {
      return this.prisma.cashSession.update({
        where: { id },
        data: {
          borrowedCash,
        },
      });
    }
  }

  async getCashSessions(userId: string) {
    const cashSession = await this.prisma.cashSession.findFirst({
      where: { userId, status: 'OPEN' },
    });

    return cashSession || {};
  }

  async getCashSessionsById(id: string) {
    const cashSession = await this.prisma.cashSession.findFirst({
      where: { id },
      include: {
        user: true,
      },
    });

    return cashSession || {};
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new Error('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id: id } });
  }
}
