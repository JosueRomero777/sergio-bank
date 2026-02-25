import { IsString, IsNotEmpty, IsEmail, IsOptional, IsInt } from 'class-validator';

export class CreateAdvisorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
