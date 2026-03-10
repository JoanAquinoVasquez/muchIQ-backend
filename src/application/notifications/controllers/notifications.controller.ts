import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from '../services/notifications.service';
import { CreateNotificationDto, CreateNotificationTypeDto } from '../dto/create-notification.dto';
import { UpdateNotificationTypeDto } from '../dto/update-notification.dto';

@ApiTags('Notification Types')
@Controller('notification-types')
export class NotificationTypesController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de notificación' })
  create(@Body() dto: CreateNotificationTypeDto) {
    return this.notificationsService.createNotificationType(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de notificación' })
  findAll() {
    return this.notificationsService.findAllNotificationTypes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de notificación por ID' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOneNotificationType(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de notificación por ID' })
  update(@Param('id') id: string, @Body() dto: UpdateNotificationTypeDto) {
    return this.notificationsService.updateNotificationType(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo de notificación por ID' })
  remove(@Param('id') id: string) {
    return this.notificationsService.removeNotificationType(id);
  }
}

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva notificación para un usuario' })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.createNotification(dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener todas las notificaciones de un usuario' })
  findAllByUserId(@Param('userId') userId: string) {
    return this.notificationsService.findAllByUserId(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación por ID' })
  remove(@Param('id') id: string) {
    return this.notificationsService.removeNotification(id);
  }
}
