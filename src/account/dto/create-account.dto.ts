import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsNotEmpty()
  @IsNumber()
  clientId: number;
}
