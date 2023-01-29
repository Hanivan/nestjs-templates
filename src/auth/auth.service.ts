import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { Objects, User, Permissions } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signupLocal(payload: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(payload.password);
    const newUser = await this.prisma.user.create({
      data: { email: payload.email, hash, role_id: payload.role_id },
    });
    const [permissions, objects] = await this.getPermissionUser(newUser);
    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      permissions,
      objects,
    );
    await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async signinLocal(payload: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) throw new ForbiddenException('access denied');

    const passwordMatches = await bcrypt.compare(payload.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('access denied');
    const [permissions, objects] = await this.getPermissionUser(user);

    const tokens = await this.getTokens(
      user.id,
      user.email,
      permissions,
      objects,
    );
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  logoutLocal(userId: number) {
    return this.prisma.user.updateMany({
      data: { refresh_token: null },
      where: { id: userId, refresh_token: { not: null } },
    });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refresh_token)
      throw new ForbiddenException('access denied');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('access denied');

    const [permissions, objects] = await this.getPermissionUser(user);
    const tokens = await this.getTokens(
      user.id,
      user.email,
      permissions,
      objects,
    );
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async getPermissionUser(
    user: User,
  ): Promise<[Partial<Permissions>[], Partial<Objects>[]]> {
    let permissionId: number[] = [];
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { role_id: user.role_id },
    });
    if (!rolePermissions.length)
      throw new ForbiddenException('role permission not found');
    rolePermissions.map((rp) => permissionId.push(rp.permission_id));

    const permissions = await this.prisma.permissions.findMany({
      where: { id: { in: permissionId } },
      select: { action: true, object_id: true, active: true },
    });
    if (!permissions.length)
      throw new ForbiddenException('permission not found');

    const objects = await this.prisma.objects.findMany({
      where: { id: permissions[0].object_id },
      select: { name: true },
    });
    if (!objects.length) throw new ForbiddenException('object not found');

    return [permissions, objects];
  }

  async hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(
    userId: number,
    email: string,
    permissions: Partial<Permissions>[],
    objects: Partial<Objects>[],
  ): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          permissions,
          objects,
        },
        {
          secret: 'access-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: null,
          roleCan: null,
        },
        {
          secret: 'refresh-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refresh_token: hash },
    });
  }
}
