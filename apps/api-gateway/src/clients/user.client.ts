import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@p2p-lending/common/constants/message-patterns';
import { RmqService } from '@p2p-lending/common/enums';
import {
  CreateUserRequest,
  mapRegisterDtoToCreateUserRequest,
  RegisterRequest,
  UserResponse,
} from '@p2p-lending/common/interfaces/message-payloads';

import { BaseClient } from './base.client';

@Injectable()
export class UserClient extends BaseClient {
  constructor(@Inject(RmqService.USER) protected readonly client: ClientProxy) {
    super(client, RmqService.USER);
  }

  async createUser(userData: RegisterRequest): Promise<UserResponse> {
    try {
      this.logger.log(`Creating user: ${JSON.stringify(userData)}`);

      // Convert RegisterDto to CreateUserRequest (removing password)
      const createUserRequest = mapRegisterDtoToCreateUserRequest(userData);
      const result = await this.send<CreateUserRequest, UserResponse>(
        { cmd: MESSAGE_PATTERNS.USER.CREATE },
        createUserRequest,
      );
      this.logger.log(`User created: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`User creation failed:`, error);
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
