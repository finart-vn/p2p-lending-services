import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@p2p-lending/common/enums';
import { firstValueFrom } from 'rxjs';
// import { ClientProxy } from '@nestjs/microservices';

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  // TODO: Add more user creation fields
}

export interface UpdateUserRequest {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  // TODO: Add more user update fields
}

export interface UserResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
  // TODO: Add more user properties
}

@Injectable()
export class UserClient {
  private readonly logger = new Logger(UserClient.name);
  constructor(
    @Inject(RmqService.USER) private readonly rmqClient: ClientProxy,
  ) {}

  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    try {
      //1. connect to the user service
      await this.rmqClient.connect();
      //2. send the request to the user service
      const result = await firstValueFrom(
        this.rmqClient.send<UserResponse>(
          { cmd: 'create_user' },
          {
            userData,
          },
        ),
      );
      //3. return the result
      return result;
    } catch (error) {
      this.logger.error(`User creation failed: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  //   async getUserById(id: string): Promise<UserResponse | null> {
  //     // TODO: Implement user retrieval by ID
  //     try {
  //       // TODO: Send request to user service
  //       // const result = await this.userService.send('get_user_by_id', { id }).toPromise();
  //       // return result;

  //       return null;
  //     } catch (error) {
  //       this.logger.error(`Failed to get user by ID: ${error.message}`);
  //       return null;
  //     }
  //   }

  //   async getUserByEmail(email: string): Promise<UserResponse | null> {
  //     // TODO: Implement user retrieval by email
  //     try {
  //       // TODO: Send request to user service
  //       return null;
  //     } catch (error) {
  //       this.logger.error(`Failed to get user by email: ${error.message}`);
  //       return null;
  //     }
  //   }

  //   async updateUser(userData: UpdateUserRequest): Promise<UserResponse> {
  //     // TODO: Implement user update
  //     try {
  //       // TODO: Send request to user service
  //       throw new Error('Not implemented');
  //     } catch (error) {
  //       this.logger.error(`User update failed: ${error.message}`);
  //       throw error;
  //     }
  //   }

  //   async deleteUser(id: string): Promise<boolean> {
  //     // TODO: Implement user deletion
  //     try {
  //       // TODO: Send request to user service
  //       return false;
  //     } catch (error) {
  //       this.logger.error(`User deletion failed: ${error.message}`);
  //       throw error;
  //     }
  //   }
}
