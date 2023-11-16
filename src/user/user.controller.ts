import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUserDto';

@Controller('user')
export class UserController {
  constructor(private user: UserService) {}

  @Get()
  findAll() {
    return this.user.getUsers();
  }

  @Get('/:Id')
  findOne(@Param('Id') Id) {
    return this.user.getUser(Id);
  }

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.user.createUser(data);
  }
}
