import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaBancoService } from '../prisma/prisma-banco.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(private prismaBanco: PrismaBancoService) { }

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
}
