import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaBancoService } from '../prisma/prisma-banco.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prismaBanco: PrismaBancoService) { }

  async create(createTransactionDto: CreateTransactionDto) {
    return this.prismaBanco.transaction.create({
      data: {
        accountOriginId: createTransactionDto.originAccountId,
        accountDestinationId: createTransactionDto.destinationAccountId,
        amount: createTransactionDto.amount,
        date: createTransactionDto.transactionAt ? new Date(createTransactionDto.transactionAt) : new Date(),
      },
      include: {
        accountOrigin: true,
        accountDestination: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prismaBanco.transaction.findMany({
        skip,
        take: limit,
        include: {
          accountOrigin: true,
          accountDestination: true,
        },
      }),
      this.prismaBanco.transaction.count(),
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
    const transaction = await this.prismaBanco.transaction.findUnique({
      where: { id },
      include: {
        accountOrigin: true,
        accountDestination: true,
      },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
}
