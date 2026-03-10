import { PartialType } from '@nestjs/swagger';
import { CreateSystemModuleDto } from './create-system-module.dto';

// Extiende PartialType — todos los campos opcionales
// parentId puede ser null para mover un módulo a raíz
export class UpdateSystemModuleDto extends PartialType(CreateSystemModuleDto) {}
