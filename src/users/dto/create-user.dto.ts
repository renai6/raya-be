import { Role } from '@prisma/client';
import { IsString, IsEmail, MinLength, IsOptional, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^\d{10,15}$/, { message: 'Contact number must be 10–15 digits' })
  contactNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: Role; // optional — defaults to USER in DB
}