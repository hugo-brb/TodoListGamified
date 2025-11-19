import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MockAuthGuard } from '../common/mock-auth.guard';
import { LeaderboardService } from './leaderboard.service';

@ApiTags('Leaderboard')
@ApiBearerAuth()
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @UseGuards(MockAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Afficher le classement',
    description:
      'Récupère le classement des utilisateurs triés par XP avec pagination optionnelle',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: "Nombre maximum d'utilisateurs à retourner",
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: "Nombre d'utilisateurs à ignorer",
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Classement récupéré avec succès',
    schema: {
      example: [
        {
          _id: '000000000000000000000002',
          username: 'alice',
          xp: 350,
          level: 7,
          rank: 1,
        },
        {
          _id: '000000000000000000000003',
          username: 'bob',
          xp: 200,
          level: 4,
          rank: 2,
        },
      ],
    },
  })
  list(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.leaderboardService.list(
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined,
    );
  }
}
