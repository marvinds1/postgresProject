import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly user: UserService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.user.getUsers(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.user.getUser(id);
  }

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.user.createUser(data);
  }
}
