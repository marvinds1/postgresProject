import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../db/prisma.service';
import { publicUserSelect, UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  type CreateArgs = { data: { email: string; name: string; password: string } };
  const prisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn<Promise<unknown>, [CreateArgs]>(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(UserService);
  });

  it('lists users with pagination and without password', async () => {
    prisma.user.findMany.mockResolvedValue([
      { id: 1, email: 'a@b.c', name: 'A' },
    ]);

    await service.getUsers({ skip: 10, take: 5 });

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      select: publicUserSelect,
      orderBy: { id: 'asc' },
      skip: 10,
      take: 5,
    });
    expect(publicUserSelect).not.toHaveProperty('password');
  });

  it('throws NotFoundException for a missing user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.getUser(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('stores a bcrypt hash, never the plain password', async () => {
    prisma.user.create.mockImplementation(({ data }: CreateArgs) =>
      Promise.resolve({ id: 1, email: data.email, name: data.name }),
    );

    await service.createUser({
      email: 'a@b.c',
      name: 'A',
      password: 'S3cret-pass',
    });

    const { data } = prisma.user.create.mock.calls[0][0];
    expect(data.password).not.toBe('S3cret-pass');
    expect(await bcrypt.compare('S3cret-pass', data.password)).toBe(true);
  });
});
