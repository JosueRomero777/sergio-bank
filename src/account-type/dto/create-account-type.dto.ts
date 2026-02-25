import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateAccountTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  totalCycles: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  durationYears: number;

  @IsNotEmpty()
  @IsInt()
  productId: number;
}
