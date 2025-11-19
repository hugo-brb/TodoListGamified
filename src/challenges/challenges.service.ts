import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, ChallengeDocument } from '../schemas/challenge.schema';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
  ) {}

  list() {
    return this.challengeModel.find().lean();
  }

  async today() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const found = await this.challengeModel
      .findOne({ date: { $gte: start, $lte: end } })
      .lean();
    return found ?? null;
  }

  async complete(challengeId: string) {
    const challenge = await this.challengeModel.findById(challengeId).lean();
    if (!challenge) {
      return { success: false, message: 'Challenge introuvable' };
    }
    // In a real app, you would track completion per user
    // For now, we just confirm the challenge exists
    return {
      success: true,
      message: 'Challenge complété',
      points: challenge.points,
    };
  }
}
