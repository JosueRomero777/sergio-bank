import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ClientAccountService } from './client-account.service';
import { CreateClientAccountDto } from './dto/create-client-account.dto';
import { UpdateClientAccountDto } from './dto/update-client-account.dto';

@Controller('client-accounts')
export class ClientAccountController {
  constructor(private readonly clientAccountService: ClientAccountService) {}

  @Post()
  create(@Body() createClientAccountDto: CreateClientAccountDto) {
    return this.clientAccountService.create(createClientAccountDto);
  }
}
