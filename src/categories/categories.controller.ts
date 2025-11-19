import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Lister les catégories',
    description:
      'Récupère la liste des catégories de tâches disponibles (catégories utilisées dans les tâches existantes)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des catégories récupérée avec succès',
    schema: {
      example: [
        'général',
        'sport',
        'travail',
        'étude',
        'vie quotidienne',
        'bien-être',
      ],
    },
  })
  async list() {
    // Get distinct categories from tasks in database
    const categories = await this.taskModel.distinct('category').exec();
    return categories.length > 0
      ? categories
      : [
          'général',
          'sport',
          'travail',
          'étude',
          'vie quotidienne',
          'bien-être',
        ];
  }
}
