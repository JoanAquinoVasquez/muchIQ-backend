import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateDishDto {
  @ApiProperty({ example: 'Arroz con Pato' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Plato emblemático de Chiclayo elaborado con pato criollo.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    required: false,
    example: 'Tiene sus raíces en la cocina mestiza española-muchik.',
  })
  @IsOptional()
  @IsString()
  history?: string;
}
