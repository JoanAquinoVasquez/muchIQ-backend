import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    @ApiProperty({ description: 'Activar o desactivar la empresa', required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
