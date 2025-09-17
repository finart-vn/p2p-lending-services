import { RoleEnum } from '../../apps/user-service/generated/prisma';
import { userPrisma } from '../prisma-clients';

/**
 * User Service Seeder
 *
 * Seeds users, roles, and user-role relationships
 */

export interface UserSeedData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  country?: string;
}

export interface RoleSeedData {
  name: RoleEnum;
  description: string;
  permissions?: any;
}

export const defaultUsers: UserSeedData[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'admin@p2plending.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1234567890',
    dateOfBirth: new Date('1985-01-01'),
    address: '123 Admin Street',
    city: 'New York',
    country: 'USA',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'john.borrower@example.com',
    firstName: 'John',
    lastName: 'Borrower',
    phone: '+1234567891',
    dateOfBirth: new Date('1990-05-15'),
    address: '456 Borrower Ave',
    city: 'Los Angeles',
    country: 'USA',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'jane.lender@example.com',
    firstName: 'Jane',
    lastName: 'Lender',
    phone: '+1234567892',
    dateOfBirth: new Date('1988-08-20'),
    address: '789 Lender Blvd',
    city: 'Chicago',
    country: 'USA',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    email: 'mike.moderator@example.com',
    firstName: 'Mike',
    lastName: 'Moderator',
    phone: '+1234567893',
    dateOfBirth: new Date('1982-12-10'),
    address: '321 Moderator Lane',
    city: 'Miami',
    country: 'USA',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    email: 'sarah.borrower@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1234567894',
    dateOfBirth: new Date('1992-03-25'),
    address: '654 Johnson Street',
    city: 'Seattle',
    country: 'USA',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    email: 'david.lender@example.com',
    firstName: 'David',
    lastName: 'Smith',
    phone: '+1234567895',
    dateOfBirth: new Date('1987-07-12'),
    address: '987 Smith Avenue',
    city: 'Boston',
    country: 'USA',
  },
];

export const defaultRoles: RoleSeedData[] = [
  {
    name: RoleEnum.ADMIN,
    description: 'System administrator with full access',
    permissions: {
      users: ['create', 'read', 'update', 'delete'],
      loans: ['create', 'read', 'update', 'delete', 'approve', 'reject'],
      investments: ['create', 'read', 'update', 'delete'],
      reports: ['read', 'export'],
    },
  },
  {
    name: RoleEnum.BORROWER,
    description: 'User who can apply for loans',
    permissions: {
      loans: ['create', 'read', 'update'],
      profile: ['read', 'update'],
      applications: ['create', 'read', 'update'],
    },
  },
  {
    name: RoleEnum.LENDER,
    description: 'User who can invest in loans',
    permissions: {
      investments: ['create', 'read', 'update'],
      loans: ['read'],
      profile: ['read', 'update'],
      portfolio: ['read'],
    },
  },
  {
    name: RoleEnum.MODERATOR,
    description: 'User who can moderate content and assist users',
    permissions: {
      users: ['read', 'update'],
      loans: ['read', 'update'],
      investments: ['read'],
      reports: ['read'],
    },
  },
];

export const userRoleAssignments = [
  { userId: '550e8400-e29b-41d4-a716-446655440001', roleName: RoleEnum.ADMIN },
  {
    userId: '550e8400-e29b-41d4-a716-446655440002',
    roleName: RoleEnum.BORROWER,
  },
  { userId: '550e8400-e29b-41d4-a716-446655440003', roleName: RoleEnum.LENDER },
  {
    userId: '550e8400-e29b-41d4-a716-446655440004',
    roleName: RoleEnum.MODERATOR,
  },
  {
    userId: '550e8400-e29b-41d4-a716-446655440005',
    roleName: RoleEnum.BORROWER,
  },
  { userId: '550e8400-e29b-41d4-a716-446655440006', roleName: RoleEnum.LENDER },
];

export async function seedUsers(): Promise<void> {
  console.log('🌱 Seeding users...');

  try {
    // Clear existing data
    await userPrisma.userRole.deleteMany();
    await userPrisma.user.deleteMany();
    await userPrisma.role.deleteMany();

    // Create roles
    console.log('Creating roles...');
    for (const roleData of defaultRoles) {
      await userPrisma.role.create({
        data: roleData,
      });
    }

    // Create users
    console.log('Creating users...');
    for (const userData of defaultUsers) {
      await userPrisma.user.create({
        data: userData,
      });
    }

    // Assign roles to users
    console.log('Assigning roles to users...');
    for (const assignment of userRoleAssignments) {
      const role = await userPrisma.role.findUnique({
        where: { name: assignment.roleName },
      });

      if (role) {
        await userPrisma.userRole.create({
          data: {
            userId: assignment.userId,
            roleId: role.id,
            assignedBy: '550e8400-e29b-41d4-a716-446655440001', // Admin user
          },
        });
      }
    }

    console.log('✅ Users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

export async function clearUsers(): Promise<void> {
  console.log('🧹 Clearing user data...');

  try {
    await userPrisma.userRole.deleteMany();
    await userPrisma.user.deleteMany();
    await userPrisma.role.deleteMany();

    console.log('✅ User data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing user data:', error);
    throw error;
  }
}
