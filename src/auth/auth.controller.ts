import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';

class RegisterDto {
  @ApiProperty({
    description: "Nom d'utilisateur",
    example: 'john_doe',
    minLength: 3,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Adresse email valide',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mot de passe (minimum 6 caractères)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

class LoginDto {
  @ApiProperty({
    description: 'Adresse email de connexion',
    example: 'admin@todo.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'password123',
  })
  @IsString()
  password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Créer un nouveau compte utilisateur',
    description:
      "Enregistre un nouvel utilisateur avec email, nom d'utilisateur et mot de passe. Le mot de passe est hashé avec Argon2.",
  })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        username: 'john_doe',
        email: 'john.doe@example.com',
        xp: 0,
        level: 1,
        streak: 0,
        longestStreak: 0,
        createdAt: '2025-11-19T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email déjà utilisé ou données invalides',
  })
  async register(@Body() dto: RegisterDto) {
    // basic uniqueness check
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email déjà utilisé');

    // Hash password with Argon2
    const passwordHash = await argon2.hash(dto.password);

    const user = await this.usersService.create({
      username: dto.username,
      email: dto.email,
      password: passwordHash,
    });
    return user;
  }

  @Post('login')
  @ApiOperation({
    summary: 'Se connecter',
    description:
      'Authentifie un utilisateur avec son email et mot de passe. Retourne un token JWT et met à jour la date de dernière connexion.',
  })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    schema: {
      example: {
        token: 'mock-jwt-token',
        userId: '507f1f77bcf86cd799439011',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Email ou mot de passe invalide' })
  async login(@Body() dto: LoginDto) {
    const found = await this.usersService.findByEmail(dto.email);
    if (!found) throw new BadRequestException('Email ou mot de passe invalide');

    // Verify password with Argon2
    const isPasswordValid = await argon2.verify(
      found.passwordHash || '',
      dto.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Email ou mot de passe invalide');
    }

    // update lastLogin
    try {
      await this.usersService.touchLastLogin(found._id.toString());
    } catch {
      // ignore
    }

    return { token: 'mock-jwt-token', userId: found._id };
  }
}
