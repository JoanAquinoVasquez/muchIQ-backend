import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'admin@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'admin123' })
    @IsNotEmpty()
    password: string;
}
