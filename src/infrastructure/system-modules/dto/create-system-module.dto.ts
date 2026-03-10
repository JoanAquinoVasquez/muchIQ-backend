import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Matches,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateSystemModuleDto {
    @ApiProperty({ description: 'Nombre visible del módulo', example: 'Empresas' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({
        description: 'Código técnico único (snake_case o dot.notation)',
        example: 'config.companies',
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-z][a-z0-9._-]*$/, {
        message: 'El código solo puede contener minúsculas, números, puntos, guiones y underscores',
    })
    @MaxLength(100)
    code: string;

    @ApiProperty({ description: 'Descripción del módulo', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiProperty({ description: 'Nombre de ícono (Flutter/Lucide)', example: 'building', required: false })
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiProperty({ description: 'Ruta frontend', example: '/admin/companies', required: false })
    @IsOptional()
    @IsString()
    path?: string;

    @ApiProperty({ description: 'Orden en el sidebar', example: 5, default: 0, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;

    @ApiProperty({ description: 'UUID del módulo padre', required: false })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiProperty({ description: 'Si el módulo está activo', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
