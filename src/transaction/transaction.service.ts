import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaBancoService } from '../prisma/prisma-banco.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prismaBanco: PrismaBancoService) { }

  async create(createTransactionDto: CreateTransactionDto) {
    // Check for duplicate transaction (same origin, destination, amount, date - ignoring milliseconds)
    const now = createTransactionDto.transactionAt ? new Date(createTransactionDto.transactionAt) : new Date();
    // Remove milliseconds for comparison
    const dateNoMs = new Date(now);
    dateNoMs.setMilliseconds(0);
    const existing = await this.prismaBanco.transaction.findFirst({
      where: {
        accountOriginId: createTransactionDto.originAccountId,
        accountDestinationId: createTransactionDto.destinationAccountId,
        amount: createTransactionDto.amount,
        date: {
          gte: new Date(dateNoMs.getTime()),
          lt: new Date(dateNoMs.getTime() + 1000),
        },
      },
    });
    if (existing) {
      throw new ConflictException('Duplicate transaction detected');
    }
    return this.prismaBanco.transaction.create({
      data: {
        accountOriginId: createTransactionDto.originAccountId,
        accountDestinationId: createTransactionDto.destinationAccountId,
        amount: createTransactionDto.amount,
        date: now,
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
  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.prismaBanco.transaction.findUnique({ where: { id } });
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return this.prismaBanco.transaction.update({
      where: { id },
      data: updateTransactionDto,
      include: {
        accountOrigin: true,
        accountDestination: true,
      },
    });
  }

  async remove(id: number) {
    const transaction = await this.prismaBanco.transaction.findUnique({ where: { id } });
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return this.prismaBanco.transaction.delete({
      where: { id },
    });
  }
  // Encuentra transacciones por cuenta y periodo financiero
  async findByAccountAndPeriod(accountId: number, periodId: number) {
    return this.prismaBanco.transaction.findMany({
      where: {
        OR: [
          { accountOriginId: accountId },
          { accountDestinationId: accountId }
        ],
        financialPeriodId: periodId
      },
      include: {
        accountOrigin: true,
        accountDestination: true,
        financialPeriod: true
      }
    });
  }

  // Reporte SQL nativo usando $queryRaw
  async getReport() {
    // Ejemplo: total de transacciones y suma de montos por periodo financiero
    const result = await this.prismaBanco.$queryRaw`SELECT fp.id as "periodId", fp.name as "periodName", COUNT(t.id) as "transactionCount", SUM(t.amount) as "totalAmount"
      FROM financial_periods fp
      LEFT JOIN transactions t ON t."financialPeriodId" = fp.id
      GROUP BY fp.id, fp.name
      ORDER BY fp.id`;
    // Convertir BigInt a string para evitar error de serialización
    return (result as any[]).map((row: any) => {
      const newRow: any = {};
      for (const key in row) {
        if (typeof row[key] === 'bigint') {
          newRow[key] = row[key].toString();
        } else {
          newRow[key] = row[key];
        }
      }
      return newRow;
    });
  }
}
