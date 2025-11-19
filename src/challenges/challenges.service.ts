import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Challenge, ChallengeDocument } from '../schemas/challenge.schema';
import {
  UserChallenge,
  UserChallengeDocument,
} from '../schemas/user-challenge.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
    @InjectModel(UserChallenge.name)
    private readonly userChallengeModel: Model<UserChallengeDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async list(userId?: Types.ObjectId) {
    const challenges = await this.challengeModel.find().lean();

    if (!userId) {
      return challenges.map((c) => ({ ...c, completed: false }));
    }

    const completedChallenges = await this.userChallengeModel
      .find({ userId })
      .select('challengeId completedAt')
      .lean();

    const completedMap = new Map(
      completedChallenges.map((uc) => [
        uc.challengeId.toString(),
        uc.completedAt,
      ]),
    );

    return challenges.map((challenge) => ({
      ...challenge,
      completed: completedMap.has(challenge._id.toString()),
      completedAt: completedMap.get(challenge._id.toString()) || null,
    }));
  }

  async today(userId?: Types.ObjectId) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const challenge = await this.challengeModel
      .findOne({ date: { $gte: start, $lte: end } })
      .lean();

    if (!challenge) return null;

    if (!userId) {
      return { ...challenge, completed: false };
    }

    // Check if user completed this challenge
    const userChallenge = await this.userChallengeModel
      .findOne({ userId, challengeId: challenge._id })
      .lean();

    return {
      ...challenge,
      completed: !!userChallenge,
      completedAt: userChallenge?.completedAt || null,
    };
  }

  async complete(challengeId: string, userId: Types.ObjectId) {
    const challenge = await this.challengeModel.findById(challengeId).lean();
    if (!challenge) {
      return { success: false, message: 'Challenge introuvable' };
    }

    // Check if already completed
    const existing = await this.userChallengeModel
      .findOne({ userId, challengeId: challenge._id })
      .lean();

    if (existing) {
      return {
        success: false,
        message: 'Challenge déjà complété',
        points: 0,
      };
    }

    // Record completion
    await this.userChallengeModel.create({
      userId,
      challengeId: challenge._id,
      pointsEarned: challenge.points,
    });

    // Award XP to user
    const xpGained = challenge.points;
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { xp: xpGained },
    });

    // Calculate new level (100 XP per level)
    const user = await this.userModel.findById(userId).lean();
    if (user) {
      const newLevel = Math.floor(user.xp / 100) + 1;
      if (newLevel > user.level) {
        await this.userModel.findByIdAndUpdate(userId, { level: newLevel });
      }
    }

    return {
      success: true,
      message: 'Challenge complété',
      points: challenge.points,
      xpGained,
    };
  }
}
