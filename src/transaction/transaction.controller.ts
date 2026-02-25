import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.transactionService.findAll(Number(page), Number(limit));
  }

  // GET /transactions/account/:accountId/period/:periodId
  @Get('account/:accountId/period/:periodId')
  findByAccountAndPeriod(
    @Param('accountId') accountId: number,
    @Param('periodId') periodId: number
  ) {
    return this.transactionService.findByAccountAndPeriod(Number(accountId), Number(periodId));
  }

  // GET /transactions/report
  @Get('report')
  getReport() {
    return this.transactionService.getReport();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.transactionService.findOne(Number(id));
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(Number(id), updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.transactionService.remove(Number(id));
  }
}
