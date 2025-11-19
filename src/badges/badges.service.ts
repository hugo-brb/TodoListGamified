import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Badge, BadgeDocument } from '../schemas/badge.schema';
import { UserBadge, UserBadgeDocument } from '../schemas/user-badge.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class BadgesService {
  constructor(
    @InjectModel(Badge.name) private readonly badgeModel: Model<BadgeDocument>,
    @InjectModel(UserBadge.name)
    private readonly userBadgeModel: Model<UserBadgeDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async listForUser(userId: Types.ObjectId) {
    // Get all badges with user earned status
    const allBadges = await this.badgeModel.find().lean();
    const userBadges = await this.userBadgeModel
      .find({ userId })
      .select('badgeId earnedAt')
      .lean();

    const userBadgeMap = new Map(
      userBadges.map((ub) => [ub.badgeId.toString(), ub.earnedAt]),
    );

    return allBadges.map((badge) => ({
      ...badge,
      earned: userBadgeMap.has(badge._id.toString()),
      earnedAt: userBadgeMap.get(badge._id.toString()) || null,
    }));
  }

  /**
   * Award a badge to a user if they don't already have it
   */
  async awardBadge(
    userId: Types.ObjectId,
    badgeName: string,
  ): Promise<boolean> {
    const badge = await this.badgeModel.findOne({ name: badgeName }).lean();
    if (!badge) return false;

    try {
      await this.userBadgeModel.create({
        userId,
        badgeId: badge._id,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check and award badges based on user stats
   */
  async checkAndAwardBadges(userId: Types.ObjectId): Promise<string[]> {
    const user = await this.userModel.findById(userId).lean();
    if (!user) return [];

    const awardedBadges: string[] = [];

    // First Task - Complete 1 task
    if (user.xp >= 10) {
      const awarded = await this.awardBadge(userId, 'Première Tâche');
      if (awarded) awardedBadges.push('Première Tâche');
    }

    // Task Master - Complete 10 tasks (10 tasks * 10 xp = 100 xp)
    if (user.xp >= 100) {
      const awarded = await this.awardBadge(userId, 'Maître des Tâches');
      if (awarded) awardedBadges.push('Maître des Tâches');
    }

    // Streak Champion - 7 day streak
    if (user.streak >= 7) {
      const awarded = await this.awardBadge(userId, 'Champion des Séries');
      if (awarded) awardedBadges.push('Champion des Séries');
    }

    // Level Up - Reach level 5
    if (user.level >= 5) {
      const awarded = await this.awardBadge(userId, 'Montée en Niveau');
      if (awarded) awardedBadges.push('Montée en Niveau');
    }

    // Early Bird - Login before 8 AM
    if (user.lastLogin) {
      const hour = user.lastLogin.getHours();
      if (hour < 8) {
        const awarded = await this.awardBadge(userId, 'Lève-tôt');
        if (awarded) awardedBadges.push('Lève-tôt');
      }
    }

    return awardedBadges;
  }
}
