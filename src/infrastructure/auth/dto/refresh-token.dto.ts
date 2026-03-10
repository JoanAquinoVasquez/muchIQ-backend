import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({
        description: 'Refresh token recibido al hacer login',
        example: 'a3f9b2c1d4e5...',
    })
    @IsString()
    @IsNotEmpty()
    refresh_token: string;
}
