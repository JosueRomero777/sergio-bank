
import { config } from 'dotenv';
config({ path: '.env' });
import { PrismaClient } from './generated/client-banco'; 
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  // Clients (datos alternativos para pruebas destructivas)
  const client1 = await prisma.client.create({
    data: {
      name: "Cliente Dummy",
      email: "dummy.cliente@banco.com",
      address: "Calle Ficticia 999",
      phone: "555-0000"
    }
  });

  // Products (dato alternativo)
  const product1 = await prisma.product.create({
    data: {
      name: "Tarjeta Dummy",
      type: "Debit Card",
      description: "Producto de prueba destructiva"
    }
  });

  // Account Types (dato alternativo)
  const accountType1 = await prisma.accountType.create({
    data: {
      name: "DummyType",
      product: { connect: { id: product1.id } }
    }
  });

  // Accounts (dato alternativo)
  const account1 = await prisma.account.create({
    data: {
      number: "DUMMY001",
      type: "SAVINGS",
      balance: 999,
      clientId: client1.id,
      accountTypeId: accountType1.id
    }
  });

  // Advisors (dato alternativo)
  const advisor1 = await prisma.advisor.create({
    data: {
      name: "Asesor Dummy",
      email: "asesor.dummy@banco.com"
      // phone: "555-0001", // Descomenta si el modelo ya tiene el campo phone
    }
  });

  // Financial Periods (dato alternativo)
  const period1 = await prisma.financialPeriod.create({
    data: {
      name: "2026-QX",
      startDate: new Date("2026-04-01T00:00:00Z"),
      endDate: new Date("2026-06-30T23:59:59Z")
    }
  });

  // Transactions (datos alternativos)
  // Para que accountDestinationId: 2 exista, creamos una segunda cuenta dummy
  const account2 = await prisma.account.create({
    data: {
      number: "DUMMY002",
      type: "CHECKING",
      balance: 888,
      clientId: client1.id,
      accountTypeId: accountType1.id
    }
  });

  await prisma.transaction.create({
    data: {
      accountOriginId: account1.id,
      accountDestinationId: account2.id,
      amount: 123,
      description: "Transacción dummy",
      financialPeriodId: period1.id
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
