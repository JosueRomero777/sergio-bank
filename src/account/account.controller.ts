import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.accountService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.accountService.findOne(Number(id));
  }
}
