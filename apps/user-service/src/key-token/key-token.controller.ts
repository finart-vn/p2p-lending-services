import { Body, Controller, Get } from '@nestjs/common';
import CreateKeyTokenDto from 'libs/DTOs/key-token/create.key-token.dto';
import { KeyTokenService } from './key-token.service';

@Controller('key-token')
export class KeyTokenController {
  constructor(private keyTokenService: KeyTokenService) {}

  @Get()
  async createKeyToken(@Body() keyToken: CreateKeyTokenDto) {
    return this.keyTokenService.createKeyToken(keyToken);
  }
}
