import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private user: UserService) {}

  @Get()
  findAll() {
    return this.user.getUser();
  }
}
