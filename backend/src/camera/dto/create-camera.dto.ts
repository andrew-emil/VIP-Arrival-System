import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CameraRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCameraDto {
  @ApiProperty({ example: 'Gate Camera 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Main gate - lane A' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: '192.168.1.10' })
  @IsString()
  @IsNotEmpty()
  ip: string;

  @ApiProperty({ enum: CameraRole, example: CameraRole.GATE })
  @IsEnum(CameraRole)
  role: CameraRole;

  @ApiProperty({ example: 'uuid-of-event' })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;
}

