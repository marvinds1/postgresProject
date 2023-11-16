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

  async createUser(data) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
      },
    });
  }

  async updateUser(id, data) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteUser(id) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async deleteAll() {
    return this.prisma.user.deleteMany();
  }

  async getUserByEmail(email) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
