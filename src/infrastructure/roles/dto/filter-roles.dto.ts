import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterRolesDto extends PaginationDto {
    @ApiProperty({
        description: 'Buscar por nombre (insensible a mayúsculas)',
        example: 'ADMIN',
        required: false,
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({
        description: 'Filtrar por estado activo/inactivo',
        example: true,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }: { value: string }) => value === 'true')
    @IsBoolean()
    isActive?: boolean;
}
