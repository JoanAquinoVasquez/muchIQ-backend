import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignPermissionDto {
    @ApiProperty({ description: 'UUID de la acción de permiso a asignar' })
    @IsUUID()
    permissionActionId: string;
}
