import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaBancoService } from '../prisma/prisma-banco.service';
import { CreateFinancialPeriodDto } from './dto/create-financial-period.dto';
import { UpdateFinancialPeriodDto } from './dto/update-financial-period.dto';

@Injectable()
export class FinancialPeriodService {
  constructor(private prismaBanco: PrismaBancoService) {}

  create(createFinancialPeriodDto: CreateFinancialPeriodDto) {
    return this.prismaBanco.financialPeriod.create({
      data: createFinancialPeriodDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prismaBanco.financialPeriod.findMany({
        skip,
        take: limit,
      }),
      this.prismaBanco.financialPeriod.count(),
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
    const financialPeriod = await this.prismaBanco.financialPeriod.findUnique({
      where: { id },
    });
    if (!financialPeriod) {
      throw new NotFoundException(`FinancialPeriod with ID ${id} not found`);
    }
    return financialPeriod;
  }
}
