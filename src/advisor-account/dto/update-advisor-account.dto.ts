import { PartialType } from '@nestjs/mapped-types';
import { CreateAdvisorAccountDto } from './create-advisor-account.dto';

export class UpdateAdvisorAccountDto extends PartialType(CreateAdvisorAccountDto) {}
