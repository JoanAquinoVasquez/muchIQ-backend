import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreatePermissionActionDto {
    @ApiProperty({ description: 'Nombre visible de la acción', example: 'EXPORT' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty({
        description: 'Código técnico único (snake_case)',
        example: 'export',
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-z][a-z0-9_]*$/, {
        message: 'El código solo puede contener minúsculas, números y underscores',
    })
    @MaxLength(50)
    code: string;

    @ApiProperty({ description: 'Descripción de la acción', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;
}
