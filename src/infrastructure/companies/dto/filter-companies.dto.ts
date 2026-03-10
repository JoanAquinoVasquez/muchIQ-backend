import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterCompaniesDto extends PaginationDto {
    @ApiProperty({ description: 'Buscar por nombre o RUC', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Filtrar por estado activo', required: false })
    @IsOptional()
    @Transform(({ value }: { value: string }) => value === 'true')
    @IsBoolean()
    isActive?: boolean;
}
