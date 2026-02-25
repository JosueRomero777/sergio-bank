import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaBancoService } from '../prisma/prisma-banco.service';
import { CreateAdvisorAccountDto } from './dto/create-advisor-account.dto';
import { UpdateAdvisorAccountDto } from './dto/update-advisor-account.dto';

@Injectable()
export class AdvisorAccountService {
  constructor(private prismaBanco: PrismaBancoService) {}

  async create(createAdvisorAccountDto: CreateAdvisorAccountDto) {
    const advisor = await this.prismaBanco.advisor.findUnique({
      where: { id: createAdvisorAccountDto.advisorId },
    });
    if (!advisor) {
      throw new BadRequestException(`Advisor with ID ${createAdvisorAccountDto.advisorId} not found`);
    }
    const account = await this.prismaBanco.account.findUnique({
      where: { id: createAdvisorAccountDto.accountId },
    });
    if (!account) {
      throw new BadRequestException(`Account with ID ${createAdvisorAccountDto.accountId} not found`);
    }
    const existingRelation = await this.prismaBanco.advisorAccount.findFirst({
      where: {
        advisorId: createAdvisorAccountDto.advisorId,
        accountId: createAdvisorAccountDto.accountId,
      },
    });
    if (existingRelation) {
      throw new ConflictException('Advisor is already assigned to this account');
    }
    return this.prismaBanco.advisorAccount.create({
      data: createAdvisorAccountDto,
      include: {
        advisor: true,
        account: true,
      },
    });
  }
}
