import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductClientDto {
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @IsInt()
  @IsNotEmpty()
  productId: number;
}
