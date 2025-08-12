import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Role, UserRole } from '@p2p-lending/user-service/generated/prisma';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);
  constructor(private readonly prisma: PrismaService) {}
  async getRoles() {
    try {
      const roles = await this.prisma.role.findMany();
      return roles;
    } catch (error) {
      console.log(error);
    }
  }
  async assignRole(
    userId: string,
    roleId: number,
    assignedBy?: string,
  ): Promise<UserRole & { role: Role }> {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
      });
      if (!role) {
        this.logger.error(`User ${userId}: ${roleId} not found`);
        throw new NotFoundException(`Role ${roleId} not found`);
      }

      const existingUserRole = await this.prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId,
            roleId: role.id,
          },
        },
        include: {
          role: true,
        },
      });

      if (existingUserRole) {
        this.logger.warn(`User ${userId} already has role ${role.name}`);
        return existingUserRole;
      }

      const newUserRole = await this.prisma.userRole.create({
        data: {
          userId,
          roleId: role.id,
          assignedBy,
        },
        include: {
          role: true,
        },
      });

      return newUserRole;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
//   /**
//    * Assign a role to a user
//    */
//   async assignRole(
//     userId: string,
//     roleName: RoleEnum,
//     assignedBy?: string,
//   ): Promise<UserRole> {
//     // First, find the role by name
//     const role = await this.prisma.role.findUnique({
//       where: { name: roleName },
//     });

//     if (!role) {
//       throw new NotFoundException(`Role ${roleName} not found`);
//     }

//     // Check if user already has this role
//     const existingUserRole = await this.prisma.userRole.findUnique({
//       where: {
//         userId_roleId: {
//           userId,
//           roleId: role.id,
//         },
//       },
//     });

//     if (existingUserRole) {
//       return existingUserRole;
//     }

//     // Assign the role to the user
//     return this.prisma.userRole.create({
//       data: {
//         userId,
//         roleId: role.id,
//         assignedBy,
//       },
//       include: {
//         role: true,
//         user: true,
//       },
//     });
//   }

//   /**
//    * Remove a role from a user
//    */
//   async removeRole(userId: string, roleName: RoleEnum): Promise<void> {
//     const role = await this.prisma.role.findUnique({
//       where: { name: roleName },
//     });

//     if (!role) {
//       throw new NotFoundException(`Role ${roleName} not found`);
//     }

//     await this.prisma.userRole.delete({
//       where: {
//         userId_roleId: {
//           userId,
//           roleId: role.id,
//         },
//       },
//     });
//   }

//   /**
//    * Get all roles assigned to a user
//    */
//   async getUserRoles(userId: string): Promise<Role[]> {
//     const userRoles = await this.prisma.userRole.findMany({
//       where: { userId },
//       include: {
//         role: true,
//       },
//     });

//     return userRoles.map((userRole) => userRole.role);
//   }

//   /**
//    * Get user permissions (from roles)
//    */
//   async getUserPermissions(userId: string): Promise<string[]> {
//     const roles = await this.getUserRoles(userId);

//     const permissions: string[] = [];
//     for (const role of roles) {
//       if (role.permissions && Array.isArray(role.permissions)) {
//         permissions.push(...(role.permissions as string[]));
//       }
//     }

//     // Remove duplicates
//     return [...new Set(permissions)];
//   }

//   /**
//    * Check if user has a specific role
//    */
//   async userHasRole(userId: string, roleName: RoleEnum): Promise<boolean> {
//     const role = await this.prisma.role.findUnique({
//       where: { name: roleName },
//     });

//     if (!role) {
//       return false;
//     }

//     const userRole = await this.prisma.userRole.findUnique({
//       where: {
//         userId_roleId: {
//           userId,
//           roleId: role.id,
//         },
//       },
//     });

//     return !!userRole;
//   }

//   /**
//    * Check if user has a specific permission
//    */
//   async userHasPermission(
//     userId: string,
//     permission: string,
//   ): Promise<boolean> {
//     const permissions = await this.getUserPermissions(userId);
//     return permissions.includes(permission);
//   }

//   /**
//    * Get all available roles
//    */
//   async getAllRoles(): Promise<Role[]> {
//     return this.prisma.role.findMany({
//       orderBy: { name: 'asc' },
//     });
//   }

//   /**
//    * Create a new role (admin function)
//    */
//   async createRole(
//     name: RoleEnum,
//     description?: string,
//     permissions?: string[],
//   ): Promise<Role> {
//     return this.prisma.role.create({
//       data: {
//         name,
//         description,
//         permissions: permissions || [],
//       },
//     });
//   }

//   /**
//    * Update role permissions (admin function)
//    */
//   async updateRolePermissions(
//     roleName: RoleEnum,
//     permissions: string[],
//   ): Promise<Role> {
//     return this.prisma.role.update({
//       where: { name: roleName },
//       data: { permissions },
//     });
//   }
// }
