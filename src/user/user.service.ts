import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

const BCRYPT_ROUNDS = 12;

export const publicUserSelect = { id: true, email: true, name: true } as const;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getUsers({ skip, take }: PaginationQueryDto) {
    return this.prisma.user.findMany({
      select: publicUserSelect,
      orderBy: { id: 'asc' },
      skip,
      take,
    });
  }

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async createUser(data: CreateUserDto) {
    const password = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    return this.prisma.user.create({
      data: { email: data.email, name: data.name, password },
      select: publicUserSelect,
    });
  }
}
