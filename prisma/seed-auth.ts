
import { config } from 'dotenv';
config({ path: '.env' });
import { PrismaClient } from './generated/client-auth';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding banco auth database...');
    await prisma.$connect();

    // --- Permisos ---
    const permissionsData = [
        { name: 'clients:read', description: 'Leer clientes' },
        { name: 'clients:write', description: 'Crear y modificar clientes' },
        { name: 'accounts:read', description: 'Leer cuentas' },
        { name: 'accounts:write', description: 'Crear y modificar cuentas' },
        { name: 'transactions:read', description: 'Leer transacciones' },
        { name: 'transactions:write', description: 'Crear y modificar transacciones' },
        { name: 'products:read', description: 'Leer productos' },
        { name: 'products:write', description: 'Crear y modificar productos' },
        { name: 'advisors:read', description: 'Leer asesores' },
        { name: 'advisors:write', description: 'Crear y modificar asesores' },
        { name: 'roles:manage', description: 'Gestionar roles y permisos' },
    ];

    console.log('Validando permisos...');
    for (const p of permissionsData) {
        await prisma.permission.upsert({
            where: { name: p.name },
            update: {},
            create: p,
        });
    }

    const allPermissions = await prisma.permission.findMany();

    // --- Roles ---
    const rolesData = [
        { name: 'ADMIN', description: 'Administrador del banco' },
        { name: 'CLIENT', description: 'Cliente del banco' },
        { name: 'ADVISOR', description: 'Asesor bancario' },
    ];

    console.log('Validando roles...');
    for (const r of rolesData) {
        await prisma.role.upsert({
            where: { name: r.name },
            update: {},
            create: r,
        });
    }

    const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'ADMIN' } });
    const clientRole = await prisma.role.findUniqueOrThrow({ where: { name: 'CLIENT' } });
    const advisorRole = await prisma.role.findUniqueOrThrow({ where: { name: 'ADVISOR' } });

    // --- RolePermissions (ADMIN tiene todos los permisos) ---
    console.log('Asignando permisos a ADMIN...');
    const adminPermissionsData = allPermissions.map((p) => ({
        roleId: adminRole.id,
        permissionId: p.id,
    }));
    await prisma.rolePermission.createMany({
        data: adminPermissionsData,
        skipDuplicates: true,
    });

    // --- Usuarios ---
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
    const hashedPasswordClient = await bcrypt.hash('client123', 10);
    const hashedPasswordAdvisor = await bcrypt.hash('advisor123', 10);

    const usersData = [
        {
            name: 'Banco Admin',
            email: 'admin@banco.com',
            username: 'admin',
            password: hashedPasswordAdmin,
            isActive: true,
            roleId: adminRole.id,
        },
        {
            name: 'Carlos Cliente',
            email: 'carlos.cliente@banco.com',
            username: 'ccliente',
            password: hashedPasswordClient,
            isActive: true,
            roleId: clientRole.id,
        },
        {
            name: 'Ana Asesora',
            email: 'ana.asesora@banco.com',
            username: 'aasesora',
            password: hashedPasswordAdvisor,
            isActive: true,
            roleId: advisorRole.id,
        },
    ];

    console.log('Validando usuarios...');
    for (const u of usersData) {
        const { roleId, ...userData } = u;
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: userData,
        });
    }

    // --- UserRoles ---
    console.log('Asignando roles a usuarios...');
    const adminUser = await prisma.user.findUniqueOrThrow({ where: { email: 'admin@banco.com' } });
    const clientUser = await prisma.user.findUniqueOrThrow({ where: { email: 'carlos.cliente@banco.com' } });
    const advisorUser = await prisma.user.findUniqueOrThrow({ where: { email: 'ana.asesora@banco.com' } });

    const userRolesData = [
        { userId: adminUser.id, roleId: adminRole.id },
        { userId: clientUser.id, roleId: clientRole.id },
        { userId: advisorUser.id, roleId: advisorRole.id },
    ];
    await prisma.userRole.createMany({
        data: userRolesData,
        skipDuplicates: true,
    });

    console.log(' Auth banco database seeded successfully (Idempotent)');
    console.log('Usuarios procesados:', { adminUser: adminUser.email, clientUser: clientUser.email, advisorUser: advisorUser.email });
}

main()
    .catch((e) => {
        console.error(' Error seeding banco auth database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
