import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class SyncPermissionsDto {
    @ApiProperty({
        description: 'Lista de UUIDs de acciones de permiso (reemplaza los actuales)',
        example: ['uuid-view', 'uuid-create'],
        type: [String],
    })
    @IsArray()
    @IsUUID('4', { each: true })
    permissionActionIds: string[];
}
