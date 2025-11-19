import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Badge, BadgeDocument } from '../schemas/badge.schema';

@Injectable()
export class BadgesService {
  constructor(
    @InjectModel(Badge.name) private readonly badgeModel: Model<BadgeDocument>,
  ) {}

  async listForUser(_userId: Types.ObjectId) {
    console.log(_userId);
    return this.badgeModel.find().lean();
  }
}
