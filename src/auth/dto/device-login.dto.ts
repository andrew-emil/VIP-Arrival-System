import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeviceLoginDto {
    @ApiProperty({ example: "device-uuid-here" })
    @IsString()
    @IsNotEmpty()
    deviceId: string;

    @ApiProperty({ example: "temporary-password-here" })
    @IsString()
    @IsNotEmpty()
    password: string;
}
