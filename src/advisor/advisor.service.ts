import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaBancoService } from '../prisma/prisma-banco.service';
import { CreateAdvisorDto } from './dto/create-advisor.dto';
import { UpdateAdvisorDto } from './dto/update-advisor.dto';

@Injectable()
export class AdvisorService {
  constructor(private prismaBanco: PrismaBancoService) { }

  create(createAdvisorDto: CreateAdvisorDto) {
    return this.prismaBanco.advisor.create({
      data: createAdvisorDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prismaBanco.advisor.findMany({
        skip,
        take: limit,
        // include: { accounts: true },
      }),
      this.prismaBanco.advisor.count(),
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
    const advisor = await this.prismaBanco.advisor.findUnique({
      where: { id },
      // include: { accounts: true },
    });
    if (!advisor) {
      throw new NotFoundException(`Advisor with ID ${id} not found`);
    }
    return advisor;
  }
}
