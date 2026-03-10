import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
    MaxLength,
} from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty({ description: 'Nombre de la empresa', example: 'Café La Merced' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    name: string;

    @ApiProperty({ description: 'RUC peruano (11 dígitos)', example: '20601234567', required: false })
    @IsOptional()
    @IsString()
    @Matches(/^\d{11}$/, { message: 'El RUC debe tener exactamente 11 dígitos' })
    ruc?: string;

    @ApiProperty({ description: 'Descripción de la empresa', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({ description: 'URL del logo', required: false })
    @IsOptional()
    @IsUrl()
    logo?: string;

    @ApiProperty({ description: 'Sitio web', example: 'https://cafelamerced.pe', required: false })
    @IsOptional()
    @IsUrl()
    website?: string;

    @ApiProperty({ description: 'Teléfono de contacto', example: '+51987654321', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;

    @ApiProperty({ description: 'Email de contacto', example: 'contacto@empresa.pe', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;
}
