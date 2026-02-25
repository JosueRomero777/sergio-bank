import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaBancoService } from '../prisma/prisma-banco.service';
import { CreateClientAccountDto } from './dto/create-client-account.dto';
import { UpdateClientAccountDto } from './dto/update-client-account.dto';

@Injectable()
export class ClientAccountService {
  constructor(private prismaBanco: PrismaBancoService) {}

  async create(createClientAccountDto: CreateClientAccountDto) {
    const client = await this.prismaBanco.client.findUnique({
      where: { id: createClientAccountDto.clientId },
    });
    if (!client) {
      throw new BadRequestException(`Client with ID ${createClientAccountDto.clientId} not found`);
    }
    const account = await this.prismaBanco.account.findUnique({
      where: { id: createClientAccountDto.accountId },
    });
    if (!account) {
      throw new BadRequestException(`Account with ID ${createClientAccountDto.accountId} not found`);
    }
    const existingRelation = await this.prismaBanco.clientAccount.findFirst({
      where: {
        clientId: createClientAccountDto.clientId,
        accountId: createClientAccountDto.accountId,
      },
    });
    if (existingRelation) {
      throw new ConflictException('Client is already linked to this account');
    }
    return this.prismaBanco.clientAccount.create({
      data: createClientAccountDto,
      include: {
        client: true,
        account: true,
      },
    });
  }
}
