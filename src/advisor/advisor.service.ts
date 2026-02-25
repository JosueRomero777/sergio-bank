import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaBancoService } from '../prisma/prisma-banco.service';
import { CreateAdvisorDto } from './dto/create-advisor.dto';
import { UpdateAdvisorDto } from './dto/update-advisor.dto';

@Injectable()
export class AdvisorService {
  constructor(private prismaBanco: PrismaBancoService) { }

  // Filtra asesores tiempo completo que gestionan cuentas O están activos usando AND/OR/NOT
  async filterComplex() {
    // Ejemplo: asesores que tienen al menos una cuenta asignada O están asociados a un periodo financiero activo
    return this.prismaBanco.advisor.findMany({
      where: {
        OR: [
          {
            advisorAccounts: {
              some: {}
            }
          },
          {
            financialPeriod: {
              isActive: true
            }
          }
        ]
      },
      include: {
        advisorAccounts: true,
        financialPeriod: true
      }
    });
  }

  async getMultipleAccounts() {
    // Asesores que gestionan 2 o más cuentas (relación por tabla intermedia si existe, si no, por cuentas directas)
    return this.prismaBanco.advisor.findMany({
      where: {
        advisorAccounts: {
          some: {}
        }
      },
      include: {
        advisorAccounts: true,
      },
    });
  }

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
  async update(id: number, updateAdvisorDto: UpdateAdvisorDto) {
    const advisor = await this.prismaBanco.advisor.findUnique({ where: { id } });
    if (!advisor) {
      throw new NotFoundException(`Advisor with id ${id} not found`);
    }
    return this.prismaBanco.advisor.update({
      where: { id },
      data: updateAdvisorDto,
    });
  }

  async remove(id: number) {
    const advisor = await this.prismaBanco.advisor.findUnique({ where: { id } });
    if (!advisor) {
      throw new NotFoundException(`Advisor with id ${id} not found`);
    }
    return this.prismaBanco.advisor.delete({
      where: { id },
    });
  }
}
