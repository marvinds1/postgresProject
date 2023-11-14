import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }
  async getUser(Id) {
    const id = parseInt(Id);
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
