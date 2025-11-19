import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HateoasHelper } from '../common/hateoas.helper';
import { TasksService } from './tasks.service';

class TaskCreateDto {
  @ApiProperty({
    description: 'Titre de la tâche',
    example: 'Faire du jogging',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description détaillée de la tâche',
    example: 'Course de 5km dans le parc',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Catégorie de la tâche',
    example: 'sport',
    required: false,
    enum: [
      'sport',
      'travail',
      'étude',
      'vie quotidienne',
      'bien-être',
      'général',
    ],
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Date limite (format ISO 8601)',
    example: '2025-11-25T18:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}

class TaskUpdateDto {
  @ApiProperty({
    description: 'Nouveau titre de la tâche',
    example: 'Faire du jogging (30 min)',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Nouvelle description',
    example: 'Course de 5km dans le parc + étirements',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Nouvelle catégorie',
    example: 'sport',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Statut de completion',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  done?: boolean;

  @ApiProperty({
    description: 'Nouvelle date limite (format ISO 8601)',
    example: '2025-11-26T18:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({
    summary: 'Lister les tâches',
    description:
      "Récupère la liste des tâches de l'utilisateur avec pagination et filtrage optionnel par catégorie",
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Nombre maximum de tâches à retourner',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    example: 0,
    description: 'Nombre de tâches à ignorer',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    example: 'sport',
    description: 'Filtrer par catégorie',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des tâches récupérée avec succès',
    schema: {
      example: [
        {
          _id: '673ec7d47f6e8b4a2f1c3d4e',
          userId: '000000000000000000000001',
          title: 'Faire du jogging',
          description: 'Course de 5km dans le parc',
          category: 'sport',
          done: false,
          deadline: '2025-11-25T18:00:00.000Z',
          createdAt: '2024-11-21T10:30:00.000Z',
        },
      ],
    },
  })
  async list(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('category') category?: string,
  ) {
    const userId = new Types.ObjectId('000000000000000000000001');
    const tasks = await this.tasksService.list({
      userId,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      category,
    });
    return HateoasHelper.addLinks(tasks, HateoasHelper.taskListLinks());
  }

  @Post()
  @ApiOperation({
    summary: 'Créer une tâche',
    description: "Crée une nouvelle tâche pour l'utilisateur connecté",
  })
  @ApiResponse({
    status: 201,
    description: 'Tâche créée avec succès',
    schema: {
      example: {
        _id: '673ec7d47f6e8b4a2f1c3d4e',
        userId: '000000000000000000000001',
        title: 'Faire du jogging',
        description: 'Course de 5km dans le parc',
        category: 'sport',
        done: false,
        deadline: '2025-11-25T18:00:00.000Z',
        createdAt: '2024-11-21T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body() dto: TaskCreateDto) {
    const userId = new Types.ObjectId('000000000000000000000001');
    const task = await this.tasksService.create({
      userId,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      deadline: dto.deadline,
    });
    return HateoasHelper.addLinks(
      task,
      HateoasHelper.taskLinks(task._id.toString()),
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Modifier une tâche',
    description: "Met à jour les informations d'une tâche existante",
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la tâche à modifier',
    example: '673ec7d47f6e8b4a2f1c3d4e',
  })
  @ApiResponse({
    status: 200,
    description: 'Tâche modifiée avec succès',
    schema: {
      example: {
        _id: '673ec7d47f6e8b4a2f1c3d4e',
        userId: '000000000000000000000001',
        title: 'Faire du jogging (30 min)',
        description: 'Course de 5km dans le parc + étirements',
        category: 'sport',
        done: false,
        deadline: '2025-11-26T18:00:00.000Z',
        createdAt: '2024-11-21T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  async update(@Param('id') id: string, @Body() dto: TaskUpdateDto) {
    const task = await this.tasksService.update(id, dto);
    return HateoasHelper.addLinks(task, HateoasHelper.taskLinks(id));
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Supprimer une tâche',
    description: 'Supprime une tâche de manière permanente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la tâche à supprimer',
    example: '673ec7d47f6e8b4a2f1c3d4e',
  })
  @ApiResponse({ status: 204, description: 'Tâche supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  async remove(@Param('id') id: string) {
    await this.tasksService.remove(id);
    return;
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary: 'Marquer une tâche comme terminée',
    description:
      "Marque une tâche comme complétée et attribue des points XP à l'utilisateur",
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la tâche à compléter',
    example: '673ec7d47f6e8b4a2f1c3d4e',
  })
  @ApiResponse({
    status: 200,
    description: 'Tâche marquée comme terminée',
    schema: {
      example: {
        message: 'Tâche complétée!',
        xpGained: 10,
        task: {
          _id: '673ec7d47f6e8b4a2f1c3d4e',
          userId: '000000000000000000000001',
          title: 'Faire du jogging',
          done: true,
          category: 'sport',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  async complete(@Param('id') id: string) {
    const result = await this.tasksService.complete(id);
    return HateoasHelper.addLinks(result, HateoasHelper.taskLinks(id));
  }
}
