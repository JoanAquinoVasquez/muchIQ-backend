import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty({ example: 'Delfosti' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: '20601234567', required: false })
    @IsOptional()
    @IsString()
    ruc?: string;

    @ApiProperty({ example: 'Empresa de tecnología líder.', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'https://delfosti.com', required: false })
    @IsOptional()
    @IsUrl()
    website?: string;
}
