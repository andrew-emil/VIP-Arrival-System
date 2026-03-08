import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashingService } from 'src/core/hashing/hashing.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
  ) { }

  async create(createUserDto: CreateUserDto, adminName: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const hashedPassword = await this.hashingService.hashPassword(
      createUserDto.password,
    );

    const createdUser = await this.prisma.user.create({
      data: {
        passwordHash: hashedPassword,
        name: createUserDto.name,
        email: createUserDto.email,
        role: createUserDto.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (createUserDto.permissions?.length) {
      await this.assignPermissions(
        createdUser.id,
        createUserDto.permissions,
        adminName,
      );
    }

    return createdUser;
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        permissions: {
          select: {
            id: true,
            permission: true,
            grantedBy: true,
            eventId: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        permissions: {
          select: {
            id: true,
            permission: true,
            grantedBy: true,
            eventId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException(`User with id "${id}" not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // throws 404 if not found

    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        role: updateUserDto.role,
        isActive: updateUserDto.isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async assignPermissions(
    userId: string,
    permissions: string[],
    adminName: string,
  ) {
    if (!permissions?.length) return;

    const createdPermissions = await this.prisma.userPermission.createMany({
      data: permissions.map((permission) => ({
        permission,
        userId,
        grantedBy: adminName,
      })),
    });

    return createdPermissions;
  }

  async revokePermission(permissionId: string) {
    const permission = await this.prisma.userPermission.findUnique({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException(
        `Permission with id "${permissionId}" not found`,
      );
    }

    return this.prisma.userPermission.delete({ where: { id: permissionId } });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // throws 404 if not found
    return this.prisma.user.delete({ where: { id } });
  }
}
