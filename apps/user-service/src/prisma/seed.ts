import { PrismaClient, RoleEnum } from '../../generated/prisma';

const prisma = new PrismaClient();

const initialRoles = [
  {
    name: RoleEnum.ADMIN,
    description: 'Admin role',
    createdAt: new Date(),
  },
  {
    name: RoleEnum.BORROWER,
    description: 'Borrower role',
    createdAt: new Date(),
  },
  {
    name: RoleEnum.LENDER,
    description: 'Lender role',
    createdAt: new Date(),
  },
];

const seedRoles = async () => {
  for (const role of initialRoles) {
    await prisma.role.create({
      data: role,
    });
  }
};

seedRoles();
