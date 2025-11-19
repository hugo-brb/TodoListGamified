import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { MockAuthGuard } from '../common/mock-auth.guard';
import { AdminGuard } from '../common/admin.guard';
import { UsersService } from './users.service';
import { Types } from 'mongoose';

class UpdateMeDto {
  @ApiProperty({
    description: "Nouveau nom d'utilisateur",
    example: 'john_doe_updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Nouvelle adresse e-mail',
    example: 'john.updated@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Nouveau mot de passe (minimum 6 caractères)',
    example: 'newpassword123',
    required: false,
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(MockAuthGuard, AdminGuard)
  @Get()
  @ApiOperation({
    summary: 'Lister tous les utilisateurs (Admin)',
    description:
      'Récupère la liste complète des utilisateurs (réservé aux administrateurs)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs récupérée avec succès',
    schema: {
      example: [
        {
          _id: '000000000000000000000001',
          username: 'admin',
          email: 'admin@todo.com',
          isAdmin: true,
          xp: 0,
          level: 1,
          streak: 0,
        },
      ],
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé (administrateur requis)',
  })
  listUsers() {
    return this.usersService.listAll();
  }

  @UseGuards(MockAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Obtenir mon profil',
    description:
      "Récupère les informations du profil de l'utilisateur connecté",
  })
  @ApiResponse({
    status: 200,
    description: 'Profil récupéré avec succès',
    schema: {
      example: {
        _id: '000000000000000000000001',
        username: 'admin',
        email: 'admin@todo.com',
        isAdmin: true,
        xp: 150,
        level: 3,
        streak: 5,
        createdAt: '2024-11-01T10:00:00.000Z',
      },
    },
  })
  me() {
    const userId = new Types.ObjectId('000000000000000000000001');
    return this.usersService.me(userId);
  }

  @UseGuards(MockAuthGuard)
  @Put('me')
  @ApiOperation({
    summary: 'Mettre à jour mon profil',
    description:
      "Met à jour les informations du profil de l'utilisateur connecté",
  })
  @ApiResponse({
    status: 200,
    description: 'Profil mis à jour avec succès',
    schema: {
      example: {
        _id: '000000000000000000000001',
        username: 'admin_updated',
        email: 'admin.updated@todo.com',
        isAdmin: true,
        xp: 150,
        level: 3,
        streak: 5,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  updateMe(@Body() dto: UpdateMeDto) {
    const userId = new Types.ObjectId('000000000000000000000001');
    return this.usersService.updateMe(userId, dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtenir un utilisateur par ID',
    description:
      "Récupère les informations publiques d'un utilisateur spécifique",
  })
  @ApiParam({
    name: 'id',
    description: "ID de l'utilisateur",
    example: '000000000000000000000002',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur trouvé',
    schema: {
      example: {
        _id: '000000000000000000000002',
        username: 'alice',
        email: 'alice@todo.com',
        isAdmin: false,
        xp: 200,
        level: 4,
        streak: 7,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @UseGuards(MockAuthGuard, AdminGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Supprimer un utilisateur (Admin)',
    description:
      'Supprime définitivement un utilisateur (réservé aux administrateurs)',
  })
  @ApiParam({
    name: 'id',
    description: "ID de l'utilisateur à supprimer",
    example: '000000000000000000000003',
  })
  @ApiResponse({
    status: 204,
    description: 'Utilisateur supprimé avec succès',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé (administrateur requis)',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get(':id/progress')
  @ApiOperation({
    summary: "Obtenir la progression d'un utilisateur",
    description:
      "Récupère les statistiques de progression (XP, niveau, streak, badges) d'un utilisateur",
  })
  @ApiParam({
    name: 'id',
    description: "ID de l'utilisateur",
    example: '000000000000000000000002',
  })
  @ApiResponse({
    status: 200,
    description: 'Progression récupérée avec succès',
    schema: {
      example: {
        xp: 200,
        level: 4,
        streak: 7,
        badges: [
          {
            _id: '673ec7d47f6e8b4a2f1c3d5a',
            name: 'Première tâche',
            description: 'Complétez votre première tâche',
            icon: '🎯',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  progress(@Param('id') id: string) {
    return this.usersService.getProgress(id);
  }
}
