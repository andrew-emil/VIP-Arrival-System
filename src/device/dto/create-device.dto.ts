import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateDeviceDto {
    @ApiProperty({ example: "Gate 1 Tablet" })
    @IsString()
    name: string;

    @ApiProperty({ example: "uuid-of-camera" })
    @IsString()
    cameraId: string;
}