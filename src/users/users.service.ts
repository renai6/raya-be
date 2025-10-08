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

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id: id } });
  }
}
