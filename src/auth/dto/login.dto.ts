import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'meshary.ib@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'pass@123.01' })
    @IsString()
    @MinLength(6)
    password: string;
}
