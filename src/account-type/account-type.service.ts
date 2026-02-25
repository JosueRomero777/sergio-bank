import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaBancoService } from '../prisma/prisma-banco.service';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';

@Injectable()
export class AccountTypeService {
  constructor(private prismaBanco: PrismaBancoService) {}

  async create(createAccountTypeDto: CreateAccountTypeDto) {
    const product = await this.prismaBanco.product.findUnique({
      where: { id: createAccountTypeDto.productId },
    });
    if (!product) {
      throw new BadRequestException(`Product with ID ${createAccountTypeDto.productId} not found`);
    }
    return this.prismaBanco.accountType.create({
      data: createAccountTypeDto,
      include: {
        product: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prismaBanco.accountType.findMany({
        skip,
        take: limit,
        include: {
          product: true,
        },
      }),
      this.prismaBanco.accountType.count(),
    ]);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const accountType = await this.prismaBanco.accountType.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
    if (!accountType) {
      throw new NotFoundException(`AccountType with ID ${id} not found`);
    }
    return accountType;
  }
}
