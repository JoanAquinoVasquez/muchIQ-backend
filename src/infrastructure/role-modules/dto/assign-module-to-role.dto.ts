import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignModuleToRoleDto {
    @ApiProperty({ description: 'UUID del módulo a asignar al rol' })
    @IsUUID()
    moduleId: string;
}
