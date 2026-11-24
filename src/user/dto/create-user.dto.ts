import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255)
  email: string;

  @IsString()
  @Length(6, 255, { message: 'name should be at least 6 characters' })
  name: string;

  @IsString()
  @Length(8, 72, { message: 'password must be 8-72 characters' })
  password: string;
}
