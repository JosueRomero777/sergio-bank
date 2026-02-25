import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaBancoService } from '../prisma/prisma-banco.service';
import { CreateProductClientDto } from './dto/create-product-client.dto';
import { UpdateProductClientDto } from './dto/update-product-client.dto';

@Injectable()
export class ProductClientService {
  constructor(private prismaBanco: PrismaBancoService) {}

  async create(createProductClientDto: CreateProductClientDto) {
    const client = await this.prismaBanco.client.findUnique({
      where: { id: createProductClientDto.clientId },
    });
    if (!client) {
      throw new BadRequestException(`Client with ID ${createProductClientDto.clientId} not found`);
    }
    const product = await this.prismaBanco.product.findUnique({
      where: { id: createProductClientDto.productId },
    });
    if (!product) {
      throw new BadRequestException(`Product with ID ${createProductClientDto.productId} not found`);
    }
    const existingRelation = await this.prismaBanco.productClient.findFirst({
      where: {
        clientId: createProductClientDto.clientId,
        productId: createProductClientDto.productId,
      },
    });
    if (existingRelation) {
      throw new ConflictException('Client is already linked to this product');
    }
    return this.prismaBanco.productClient.create({
      data: createProductClientDto,
      include: {
        client: true,
        product: true,
      },
    });
  }
}
