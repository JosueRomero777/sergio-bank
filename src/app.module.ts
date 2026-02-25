import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { AccountModule } from './account/account.module';
import { AdvisorModule } from './advisor/advisor.module';
import { AdvisorAccountModule } from './advisor-account/advisor-account.module';
import { ClientAccountModule } from './client-account/client-account.module';
import { AccountTypeModule } from './account-type/account-type.module';
import { FinancialPeriodModule } from './financial-period/financial-period.module';
import { TransactionModule } from './transaction/transaction.module';
import { ProductModule } from './product/product.module';
import { ProductClientModule } from './product/product-client.module';





@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    ClientModule,
    AccountModule,
    AdvisorModule,
    AdvisorAccountModule,
    ClientAccountModule,
    AccountTypeModule,
    FinancialPeriodModule,
    TransactionModule,
    ProductModule,
    ProductClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

