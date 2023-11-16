// create dto for user
// email unique with email validator
import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Length(6, 255, { message: 'name should be at least 6 characters' })
  name: string;

  @Length(6, 255, { message: 'password should be at least 6 characters' })
  password: string;
}
