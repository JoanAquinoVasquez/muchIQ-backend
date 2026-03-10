import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsHexColor,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({
        description: 'Nombre único del rol (mayúsculas por convención)',
        example: 'MODERATOR',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty({
        description: 'Descripción del rol',
        example: 'Puede moderar contenido pero no gestionar usuarios',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiProperty({
        description: 'Color hex para identificar el rol en la UI',
        example: '#8B5CF6',
        required: false,
    })
    @IsOptional()
    @IsHexColor()
    color?: string;

    @ApiProperty({
        description: 'Si el rol está activo',
        example: true,
        default: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
