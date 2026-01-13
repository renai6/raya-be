import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from 'prisma/prisma.service';
import { ALLOWED_USERS } from 'lib/constants';
import { logger } from 'lib/utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const sessionId = randomUUID();

    if (!ALLOWED_USERS.includes(user.id)) {
      logger(user);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        activeSessionId: sessionId,
        lastLoginAt: new Date(),
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }
}
