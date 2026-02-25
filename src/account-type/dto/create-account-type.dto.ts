import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateAccountTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;


  @IsNotEmpty()
  @IsInt()
  productId: number;
}
