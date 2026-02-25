import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateFinancialPeriodDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  number: number;
}
