import { Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChallengesService } from './challenges.service';
import { AuthenticatedUser } from '../auth/jwt.strategy';

interface AuthRequest {
  user: AuthenticatedUser;
}

@ApiTags('Challenges')
@ApiBearerAuth()
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @UseGuards(JwtAuthGuard)
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
          completed: false,
        },
      ],
    },
  })
  list(@Req() req: AuthRequest) {
    return this.challengesService.list(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
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
        completed: false,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Aucun challenge du jour disponible',
  })
  today(@Req() req: AuthRequest) {
    return this.challengesService.today(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
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
  async complete(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.challengesService.complete(id, req.user.userId);
  }
}
