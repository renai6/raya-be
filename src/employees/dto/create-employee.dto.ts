import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  employeeNumber: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
