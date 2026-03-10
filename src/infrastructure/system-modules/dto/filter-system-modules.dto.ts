import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterSystemModulesDto extends PaginationDto {
    @ApiProperty({ description: 'Buscar por nombre o código', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Filtrar por estado activo', required: false })
    @IsOptional()
    @Transform(({ value }: { value: string }) => value === 'true')
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ description: 'UUID del padre para filtrar hijos directos', required: false })
    @IsOptional()
    @IsUUID()
    parentId?: string;
}
