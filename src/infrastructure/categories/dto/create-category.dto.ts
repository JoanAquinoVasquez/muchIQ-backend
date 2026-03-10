import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ description: 'Nombre único de la categoría', example: 'Arqueología' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({ description: 'Descripción de la categoría', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiProperty({ description: 'Nombre de ícono (Lucide/Flutter)', example: 'landmark', required: false })
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiProperty({ description: 'Si la categoría está activa', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
