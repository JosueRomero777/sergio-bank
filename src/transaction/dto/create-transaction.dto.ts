import { IsInt, IsNotEmpty, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsInt()
  originAccountId: number;

  @IsNotEmpty()
  @IsInt()
  destinationAccountId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsDateString()
  transactionAt?: string;
}
