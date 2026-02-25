import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FinancialPeriodService } from './financial-period.service';
import { CreateFinancialPeriodDto } from './dto/create-financial-period.dto';
import { UpdateFinancialPeriodDto } from './dto/update-financial-period.dto';

@Controller('financial-periods')
export class FinancialPeriodController {
  constructor(private readonly financialPeriodService: FinancialPeriodService) {}

  @Post()
  create(@Body() createFinancialPeriodDto: CreateFinancialPeriodDto) {
    return this.financialPeriodService.create(createFinancialPeriodDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.financialPeriodService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.financialPeriodService.findOne(Number(id));
  }
}
