import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateDeviceDto {
    @ApiProperty({ example: "Gate 1 Tablet" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: "uuid-of-camera" })
    @IsUUID()
    @IsNotEmpty()
    cameraId: string;
}