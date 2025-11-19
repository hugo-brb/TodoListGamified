import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async list(limit?: number, offset?: number) {
    const users = await this.userModel
      .find()
      .sort({ xp: -1 })
      .skip(offset ?? 0)
      .limit(limit ?? 0)
      .lean();
    return users.map((u, index) => ({
      rank: (offset ?? 0) + index + 1,
      userId: u._id,
      username: u.username,
      xp: u.xp,
      level: u.level,
    }));
  }
}
