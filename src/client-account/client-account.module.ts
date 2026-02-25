import { Module } from '@nestjs/common';
import { ClientAccountService } from './client-account.service';
import { ClientAccountController } from './client-account.controller';

@Module({
  controllers: [ClientAccountController],
  providers: [ClientAccountService],
})
export class ClientAccountModule {}
