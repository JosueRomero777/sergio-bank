import { Module } from '@nestjs/common';
import { AdvisorAccountService } from './advisor-account.service';
import { AdvisorAccountController } from './advisor-account.controller';

@Module({
  controllers: [AdvisorAccountController],
  providers: [AdvisorAccountService],
})
export class AdvisorAccountModule {}
