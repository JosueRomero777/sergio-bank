import { IsInt, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsString } from 'class-validator';

export class CreateClientAccountDto {
  @IsNotEmpty()
  @IsInt()
  clientId: number;

  @IsNotEmpty()
  @IsInt()
  accountId: number;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsNotEmpty()
  @IsString()
  status: string;
}
