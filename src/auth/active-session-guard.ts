import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ActiveSessionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // set by JwtAuthGuard

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: { activeSessionId: true },
    });

    if (!dbUser || !dbUser.activeSessionId) {
      throw new UnauthorizedException();
    }

    if (dbUser.activeSessionId !== user.sessionId) {
      throw new UnauthorizedException(
        'Your account is active on another device.',
      );
    }

    return true;
  }
}
