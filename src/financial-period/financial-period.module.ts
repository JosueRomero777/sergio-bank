import { Module } from '@nestjs/common';
import { FinancialPeriodService } from './financial-period.service';
import { FinancialPeriodController } from './financial-period.controller';

@Module({
  controllers: [FinancialPeriodController],
  providers: [FinancialPeriodService],
})
export class FinancialPeriodModule {}
