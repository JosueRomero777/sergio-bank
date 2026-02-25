import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AdvisorAccountService } from './advisor-account.service';
import { CreateAdvisorAccountDto } from './dto/create-advisor-account.dto';
import { UpdateAdvisorAccountDto } from './dto/update-advisor-account.dto';

@Controller('advisor-accounts')
export class AdvisorAccountController {
  constructor(private readonly advisorAccountService: AdvisorAccountService) {}

  @Post()
  create(@Body() createAdvisorAccountDto: CreateAdvisorAccountDto) {
    return this.advisorAccountService.create(createAdvisorAccountDto);
  }
}
