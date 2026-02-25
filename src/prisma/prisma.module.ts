import { Module, Global } from '@nestjs/common';
import { PrismaAuthService } from './prisma-auth.service';
import { PrismaSupportService } from './prisma-support.service';
import { PrismaBancoService } from './prisma-banco.service';

@Global()
@Module({
    providers: [PrismaAuthService, PrismaBancoService, PrismaSupportService],
    exports: [PrismaAuthService, PrismaBancoService, PrismaSupportService],
})
export class PrismaModule { }
