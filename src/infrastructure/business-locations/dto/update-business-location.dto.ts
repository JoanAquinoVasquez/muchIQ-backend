import { PartialType } from '@nestjs/swagger';
import { CreateBusinessLocationDto } from './create-business-location.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateBusinessLocationDto extends PartialType(CreateBusinessLocationDto) {
    @ApiProperty({ description: 'Activar o desactivar el local', required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
