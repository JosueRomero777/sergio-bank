import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { AccountTypeService } from './account-type.service';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';

@Controller('account-types')
export class AccountTypeController {
  constructor(private readonly accountTypeService: AccountTypeService) {}

  @Post()
  create(@Body() createAccountTypeDto: CreateAccountTypeDto) {
    return this.accountTypeService.create(createAccountTypeDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.accountTypeService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.accountTypeService.findOne(Number(id));
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAccountTypeDto: UpdateAccountTypeDto) {
    return this.accountTypeService.update(Number(id), updateAccountTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.accountTypeService.remove(Number(id));
  }
}
