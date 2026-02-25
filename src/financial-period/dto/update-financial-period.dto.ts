import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancialPeriodDto } from './create-financial-period.dto';

export class UpdateFinancialPeriodDto extends PartialType(CreateFinancialPeriodDto) {}
