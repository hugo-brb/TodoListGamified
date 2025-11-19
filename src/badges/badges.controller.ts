import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HateoasHelper } from '../common/hateoas.helper';
import { BadgesService } from './badges.service';
import { Types } from 'mongoose';

@ApiTags('Badges')
@ApiBearerAuth()
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Lister les badges',
    description:
      "Récupère la liste des badges disponibles et indique ceux débloqués par l'utilisateur connecté",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des badges récupérée avec succès',
    schema: {
      example: [
        {
          _id: '673ec7d47f6e8b4a2f1c3d5a',
          name: 'Première tâche',
          description: 'Complétez votre première tâche',
          icon: '🎯',
          unlockedBy: ['000000000000000000000001'],
        },
        {
          _id: '673ec7d47f6e8b4a2f1c3d5b',
          name: 'Marathon des tâches',
          description: 'Complétez 10 tâches',
          icon: '🏃',
          unlockedBy: [],
        },
      ],
    },
  })
  async list() {
    const userId = new Types.ObjectId('000000000000000000000001');
    const badges = await this.badgesService.listForUser(userId);
    return HateoasHelper.addLinks(badges, HateoasHelper.badgeListLinks());
  }
}
