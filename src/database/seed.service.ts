import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Task } from '../schemas/task.schema';
import { Badge } from '../schemas/badge.schema';
import { Challenge } from '../schemas/challenge.schema';
import * as argon2 from 'argon2';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Badge.name) private badgeModel: Model<Badge>,
    @InjectModel(Challenge.name) private challengeModel: Model<Challenge>,
  ) {}

  async seedDatabase() {
    try {
      // Check if database contain already data
      const userCount = await this.userModel.countDocuments();
      if (userCount > 0) {
        this.logger.log(
          'La base de données contient déjà des données. Seed ignoré.',
        );
        return;
      }

      this.logger.log('🌱 Début du seed de la base de données...');

      // Seed Users
      await this.seedUsers();

      // Seed Badges
      await this.seedBadges();

      // Seed Challenges
      await this.seedChallenges();

      // Seed Tasks
      await this.seedTasks();

      this.logger.log('✅ Seed terminé avec succès!');
    } catch (error) {
      this.logger.error('❌ Erreur lors du seed:', error);
      throw error;
    }
  }

  private async seedUsers() {
    const hashedPassword = await argon2.hash('password123');

    const users = [
      {
        _id: '000000000000000000000001',
        username: 'admin',
        email: 'admin@todo.com',
        passwordHash: hashedPassword,
        xp: 1250,
        level: 5,
        streak: 15,
        longestStreak: 20,
        lastLogin: new Date('2025-11-18'),
        createdAt: new Date('2025-01-01'),
      },
      {
        _id: '000000000000000000000002',
        username: 'alice',
        email: 'alice@example.com',
        passwordHash: hashedPassword,
        xp: 850,
        level: 4,
        streak: 7,
        longestStreak: 12,
        lastLogin: new Date('2025-11-17'),
        createdAt: new Date('2025-02-15'),
      },
      {
        _id: '000000000000000000000003',
        username: 'bob',
        email: 'bob@example.com',
        passwordHash: hashedPassword,
        xp: 450,
        level: 3,
        streak: 3,
        longestStreak: 8,
        lastLogin: new Date('2025-11-16'),
        createdAt: new Date('2025-03-10'),
      },
      {
        _id: '000000000000000000000004',
        username: 'charlie',
        email: 'charlie@example.com',
        passwordHash: hashedPassword,
        xp: 200,
        level: 2,
        streak: 1,
        longestStreak: 4,
        lastLogin: new Date('2025-11-18'),
        createdAt: new Date('2025-05-20'),
      },
      {
        _id: '000000000000000000000005',
        username: 'diana',
        email: 'diana@example.com',
        passwordHash: hashedPassword,
        xp: 50,
        level: 1,
        streak: 0,
        longestStreak: 2,
        lastLogin: new Date('2025-11-10'),
        createdAt: new Date('2025-10-01'),
      },
    ];

    await this.userModel.insertMany(users);
    this.logger.log(`✓ ${users.length} utilisateurs créés`);
  }

  private async seedBadges() {
    const badges = [
      {
        _id: '100000000000000000000001',
        name: 'Premier pas',
        icon: '🎯',
        description: 'Complétez votre première tâche',
        condition: 'Compléter 1 tâche',
      },
      {
        _id: '100000000000000000000002',
        name: 'Productif',
        icon: '⚡',
        description: 'Complétez 10 tâches',
        condition: 'Compléter 10 tâches',
      },
      {
        _id: '100000000000000000000003',
        name: 'Marathonien',
        icon: '🏃',
        description: 'Maintenez un streak de 7 jours',
        condition: 'Streak de 7 jours consécutifs',
      },
      {
        _id: '100000000000000000000004',
        name: 'Expert',
        icon: '👑',
        description: 'Atteignez le niveau 5',
        condition: 'Atteindre le niveau 5',
      },
      {
        _id: '100000000000000000000005',
        name: 'Organisateur',
        icon: '📋',
        description: 'Créez des tâches dans 5 catégories différentes',
        condition: 'Utiliser 5 catégories différentes',
      },
      {
        _id: '100000000000000000000006',
        name: 'Défi Maître',
        icon: '🎖️',
        description: 'Complétez 5 défis quotidiens',
        condition: 'Compléter 5 défis',
      },
    ];

    await this.badgeModel.insertMany(badges);
    this.logger.log(`✓ ${badges.length} badges créés`);
  }

  private async seedChallenges() {
    const today = new Date('2025-11-18');
    const challenges = [
      {
        _id: '200000000000000000000001',
        title: 'Productivité matinale',
        description: 'Complétez 3 tâches avant midi',
        points: 50,
        date: new Date(today.setDate(today.getDate())),
      },
      {
        _id: '200000000000000000000002',
        title: 'Sprint sportif',
        description: 'Complétez 2 tâches dans la catégorie sport',
        points: 40,
        date: new Date(today.setDate(today.getDate() - 1)),
      },
      {
        _id: '200000000000000000000003',
        title: 'Apprentissage continu',
        description: 'Complétez 1 tâche dans la catégorie étude',
        points: 30,
        date: new Date(today.setDate(today.getDate() - 2)),
      },
      {
        _id: '200000000000000000000004',
        title: 'Équilibre parfait',
        description: 'Complétez au moins 1 tâche dans 3 catégories différentes',
        points: 60,
        date: new Date(today.setDate(today.getDate() - 3)),
      },
      {
        _id: '200000000000000000000005',
        title: 'Super productif',
        description: 'Complétez 5 tâches en une journée',
        points: 75,
        date: new Date(today.setDate(today.getDate() - 4)),
      },
    ];

    await this.challengeModel.insertMany(challenges);
    this.logger.log(`✓ ${challenges.length} challenges créés`);
  }

  private async seedTasks() {
    const tasks = [
      // Tâches de l'admin (user 1)
      {
        userId: '000000000000000000000001',
        title: 'Faire du jogging',
        description: 'Course de 5km dans le parc',
        category: 'sport',
        done: true,
        points: 20,
        deadline: new Date('2025-11-20'),
        completedAt: new Date('2025-11-15'),
        createdAt: new Date('2025-11-10'),
      },
      {
        userId: '000000000000000000000001',
        title: 'Réviser le cours de mathématiques',
        description: 'Chapitres 3 et 4 sur les intégrales',
        category: 'étude',
        done: true,
        points: 30,
        deadline: new Date('2025-11-19'),
        completedAt: new Date('2025-11-16'),
        createdAt: new Date('2025-11-12'),
      },
      {
        userId: '000000000000000000000001',
        title: 'Préparer la présentation',
        description: 'Slides pour la réunion client',
        category: 'travail',
        done: false,
        points: 25,
        deadline: new Date('2025-11-22'),
        completedAt: null,
        createdAt: new Date('2025-11-17'),
      },
      {
        userId: '000000000000000000000001',
        title: 'Faire les courses',
        description: 'Liste : légumes, fruits, pain',
        category: 'vie quotidienne',
        done: false,
        points: 10,
        deadline: new Date('2025-11-19'),
        completedAt: null,
        createdAt: new Date('2025-11-18'),
      },
      {
        userId: '000000000000000000000001',
        title: 'Méditation du soir',
        description: '15 minutes de méditation guidée',
        category: 'bien-être',
        done: false,
        points: 15,
        deadline: new Date('2025-11-18'),
        completedAt: null,
        createdAt: new Date('2025-11-18'),
      },

      // Tâches d'Alice (user 2)
      {
        userId: '000000000000000000000002',
        title: 'Yoga matinal',
        description: 'Session de 30 minutes',
        category: 'sport',
        done: true,
        points: 20,
        deadline: new Date('2025-11-18'),
        completedAt: new Date('2025-11-18'),
        createdAt: new Date('2025-11-15'),
      },
      {
        userId: '000000000000000000000002',
        title: 'Lire un chapitre du livre de philosophie',
        description: 'Kant - Critique de la raison pure',
        category: 'étude',
        done: false,
        points: 25,
        deadline: new Date('2025-11-20'),
        completedAt: null,
        createdAt: new Date('2025-11-16'),
      },
      {
        userId: '000000000000000000000002',
        title: 'Appeler maman',
        description: 'Prendre des nouvelles',
        category: 'vie quotidienne',
        done: true,
        points: 10,
        deadline: new Date('2025-11-17'),
        completedAt: new Date('2025-11-17'),
        createdAt: new Date('2025-11-17'),
      },

      // Tâches de Bob (user 3)
      {
        userId: '000000000000000000000003',
        title: 'Finir le projet Node.js',
        description: 'Implémenter les routes manquantes',
        category: 'travail',
        done: false,
        points: 40,
        deadline: new Date('2025-11-25'),
        completedAt: null,
        createdAt: new Date('2025-11-10'),
      },
      {
        userId: '000000000000000000000003',
        title: 'Natation',
        description: '1h de piscine',
        category: 'sport',
        done: true,
        points: 20,
        deadline: new Date('2025-11-16'),
        completedAt: new Date('2025-11-16'),
        createdAt: new Date('2025-11-15'),
      },
      {
        userId: '000000000000000000000003',
        title: "Nettoyer l'appartement",
        description: 'Grand ménage de printemps',
        category: 'vie quotidienne',
        done: false,
        points: 15,
        deadline: new Date('2025-11-21'),
        completedAt: null,
        createdAt: new Date('2025-11-18'),
      },

      // Tâches de Charlie (user 4)
      {
        userId: '000000000000000000000004',
        title: 'Exercices de programmation',
        description: 'LeetCode - 3 problèmes',
        category: 'étude',
        done: true,
        points: 30,
        deadline: new Date('2025-11-18'),
        completedAt: new Date('2025-11-18'),
        createdAt: new Date('2025-11-17'),
      },
      {
        userId: '000000000000000000000004',
        title: "Acheter un cadeau d'anniversaire",
        description: "Pour l'anniversaire de Sophie",
        category: 'vie quotidienne',
        done: false,
        points: 10,
        deadline: new Date('2025-11-23'),
        completedAt: null,
        createdAt: new Date('2025-11-18'),
      },

      // Tâches de Diana (user 5)
      {
        userId: '000000000000000000000005',
        title: 'Créer un compte GitHub',
        description: 'Pour mes projets de cours',
        category: 'travail',
        done: true,
        points: 15,
        deadline: new Date('2025-11-15'),
        completedAt: new Date('2025-11-14'),
        createdAt: new Date('2025-11-10'),
      },
      {
        userId: '000000000000000000000005',
        title: 'Marche en forêt',
        description: "Promenade d'1h",
        category: 'sport',
        done: false,
        points: 15,
        deadline: new Date('2025-11-20'),
        completedAt: null,
        createdAt: new Date('2025-11-18'),
      },
    ];

    await this.taskModel.insertMany(tasks);
    this.logger.log(`✓ ${tasks.length} tâches créées`);
  }

  async clearDatabase() {
    this.logger.log('🗑️  Nettoyage de la base de données...');

    await this.userModel.deleteMany({});
    await this.taskModel.deleteMany({});
    await this.badgeModel.deleteMany({});
    await this.challengeModel.deleteMany({});

    this.logger.log('✅ Base de données nettoyée');
  }
}
