import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MockAuthGuard } from '../common/mock-auth.guard';
import { ChallengesService } from './challenges.service';

@ApiTags('Challenges')
@ApiBearerAuth()
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @UseGuards(MockAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Lister tous les challenges',
    description: 'Récupère la liste complète des challenges disponibles',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des challenges récupérée avec succès',
    schema: {
      example: [
        {
          _id: '673ec7d47f6e8b4a2f1c3d6a',
          title: 'Semaine sportive',
          description: 'Complétez 5 tâches de catégorie "sport" cette semaine',
          points: 50,
          category: 'sport',
          difficulty: 'moyen',
          expiresAt: '2024-11-30T23:59:59.000Z',
        },
      ],
    },
  })
  list() {
    return this.challengesService.list();
  }

  @UseGuards(MockAuthGuard)
  @Get('today')
  @ApiOperation({
    summary: 'Challenge du jour',
    description: 'Récupère le challenge quotidien actif',
  })
  @ApiResponse({
    status: 200,
    description: 'Challenge du jour récupéré avec succès',
    schema: {
      example: {
        _id: '673ec7d47f6e8b4a2f1c3d6a',
        title: 'Productivité maximale',
        description: "Complétez 3 tâches aujourd'hui",
        points: 30,
        category: 'général',
        difficulty: 'facile',
        expiresAt: '2024-11-21T23:59:59.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Aucun challenge du jour disponible',
  })
  today() {
    return this.challengesService.today();
  }

  @UseGuards(MockAuthGuard)
  @Post(':id/complete')
  @ApiOperation({
    summary: 'Compléter un challenge',
    description:
      "Marque un challenge comme complété et attribue les points à l'utilisateur",
  })
  @ApiParam({
    name: 'id',
    description: 'ID du challenge à compléter',
    example: '673ec7d47f6e8b4a2f1c3d6a',
  })
  @ApiResponse({
    status: 200,
    description: 'Challenge complété avec succès',
    schema: {
      example: {
        success: true,
        message: 'Challenge complété!',
        points: 50,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Challenge non trouvé',
  })
  async complete(@Param('id') id: string) {
    return this.challengesService.complete(id);
  }
}
