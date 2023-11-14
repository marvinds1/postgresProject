import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private user: UserService) {}

  @Get()
  findAll() {
    return this.user.getUsers();
  }

  @Get('/:Id')
  findOne(@Param('Id') Id) {
    // console.log(Id);
    return this.user.getUser(Id);
  }
}
