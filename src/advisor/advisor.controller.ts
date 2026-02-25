import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { AdvisorService } from './advisor.service';
import { CreateAdvisorDto } from './dto/create-advisor.dto';
import { UpdateAdvisorDto } from './dto/update-advisor.dto';

@Controller('advisors')
export class AdvisorController {
  constructor(private readonly advisorService: AdvisorService) {}

  @Get('multiple-accounts')
  getMultipleAccounts() {
    return this.advisorService.getMultipleAccounts();
  }

  // GET /advisors/filter-complex
  @Get('filter-complex')
  filterComplex() {
    return this.advisorService.filterComplex();
  }

  @Post()
  create(@Body() createAdvisorDto: CreateAdvisorDto) {
    return this.advisorService.create(createAdvisorDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.advisorService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.advisorService.findOne(Number(id));
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAdvisorDto: UpdateAdvisorDto) {
    return this.advisorService.update(Number(id), updateAdvisorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.advisorService.remove(Number(id));
  }
}
