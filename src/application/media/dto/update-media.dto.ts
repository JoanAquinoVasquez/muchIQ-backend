import { PartialType } from '@nestjs/swagger';
import { CreateMediaTypeDto, CreateMediaDto } from './create-media.dto';

export class UpdateMediaTypeDto extends PartialType(CreateMediaTypeDto) {}
