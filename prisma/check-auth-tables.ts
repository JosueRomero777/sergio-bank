import { PrismaClient } from './generated/client-auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Tabla User:', await prisma.user.findMany());
  console.log('Tabla Role:', await prisma.role.findMany());
  console.log('Tabla Permission:', await prisma.permission.findMany());
  console.log('Tabla UserRole:', await prisma.userRole.findMany());
  console.log('Tabla RolePermission:', await prisma.rolePermission.findMany());
  await prisma.$disconnect();
}

main().catch(console.error);