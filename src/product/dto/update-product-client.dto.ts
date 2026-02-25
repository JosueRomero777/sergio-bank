import { PartialType } from '@nestjs/mapped-types';
import { CreateProductClientDto } from './create-product-client.dto';

export class UpdateProductClientDto extends PartialType(CreateProductClientDto) {}
