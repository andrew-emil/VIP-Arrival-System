import { IsString, IsOptional } from 'class-validator';

export class CreateVipDto {
    @IsString()
    plate: string;

    @IsOptional()
    @IsString()
    name?: string;
}
