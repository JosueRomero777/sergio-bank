import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaBancoService } from '../prisma/prisma-banco.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(private prismaBanco: PrismaBancoService) { }

  async getByClient(clientId: number) {
    return this.prismaBanco.account.findMany({
      where: { clientId },
      include: {
        transactionsOrigin: true,
        transactionsDestination: true,
      },
    });
  }

  async create(createAccountDto: CreateAccountDto) {
    return this.prismaBanco.account.create({
      data: createAccountDto,
      include: {
        client: true,
        transactionsOrigin: true,
        transactionsDestination: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prismaBanco.account.findMany({
        skip,
        take: limit,
        include: {
          client: true,
          transactionsOrigin: true,
          transactionsDestination: true,
        },
      }),
      this.prismaBanco.account.count(),
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
    return this.prismaBanco.account.findUnique({
      where: { id },
      include: {
        client: true,
        transactionsOrigin: true,
        transactionsDestination: true,
      },
    });
  }
  async update(id: number, updateAccountDto: UpdateAccountDto) {
    const account = await this.prismaBanco.account.findUnique({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    return this.prismaBanco.account.update({
      where: { id },
      data: updateAccountDto,
      include: {
        client: true,
        transactionsOrigin: true,
        transactionsDestination: true,
      },
    });
  }

  async remove(id: number) {
    const account = await this.prismaBanco.account.findUnique({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    return this.prismaBanco.account.delete({
      where: { id },
    });
  }
}
