import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ApiInvestmentCancelRequestDto {
  @ApiProperty({
    description: 'Investment ID',
    example: 'd80fa95a-e1ca-400d-a97a-66d33423cdc9',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Cancellation reason',
    example: 'Changed investment strategy',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
