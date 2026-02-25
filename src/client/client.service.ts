import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaBancoService } from '../prisma/prisma-banco.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(private prismaBanco: PrismaBancoService) { }

  async getActiveWithAccounts() {
    return this.prismaBanco.client.findMany({
      where: { accounts: { some: {} } },
      include: { accounts: true },
    });
  }

  async filterClients(accountTypeId: number, periodId: number) {
    // Clientes con cuentas de un tipo y transacciones en un periodo (AND)
    return this.prismaBanco.client.findMany({
      where: {
        accounts: {
          some: {
            accountTypeId: accountTypeId,
            transactionsOrigin: {
              some: { financialPeriodId: periodId }
            }
          }
        }
      },
      include: { accounts: true },
    });
  }

  async create(createClientDto: CreateClientDto) {
    return this.prismaBanco.client.create({
      data: createClientDto,
      include: {
        accounts: true,
        products: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prismaBanco.client.findMany({
        skip,
        take: limit,
        include: {
          accounts: true,
          products: true,
        },
      }),
      this.prismaBanco.client.count(),
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
    return this.prismaBanco.client.findUnique({
      where: { id },
      include: {
        accounts: true,
        products: true,
      },
    });
  }
  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.prismaBanco.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    return this.prismaBanco.client.update({
      where: { id },
      data: updateClientDto,
      include: {
        accounts: true,
        products: true,
      },
    });
  }

  async remove(id: number) {
    const client = await this.prismaBanco.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    return this.prismaBanco.client.delete({
      where: { id },
    });
  }
}
