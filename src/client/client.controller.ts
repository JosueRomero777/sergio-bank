import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('active-with-accounts')
  getActiveWithAccounts() {
    return this.clientService.getActiveWithAccounts();
  }

  @Get('filter')
  filterClients(@Query('accountTypeId') accountTypeId: string, @Query('periodId') periodId: string) {
    return this.clientService.filterClients(Number(accountTypeId), Number(periodId));
  }

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.clientService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.clientService.findOne(Number(id));
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(Number(id), updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.clientService.remove(Number(id));
  }
}
