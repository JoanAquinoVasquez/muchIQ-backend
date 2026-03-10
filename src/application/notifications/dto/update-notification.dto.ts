import { PartialType } from '@nestjs/swagger';
import { CreateNotificationTypeDto } from './create-notification.dto';

export class UpdateNotificationTypeDto extends PartialType(CreateNotificationTypeDto) {}
