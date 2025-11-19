import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as argon2 from 'argon2';

interface UpdateMeInput {
  username?: string;
  email?: string;
  password?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async listAll() {
    return this.userModel.find().lean();
  }

  async create(input: { username: string; email: string; password: string }) {
    const doc = await this.userModel.create({
      username: input.username,
      email: input.email,
      passwordHash: input.password,
    });
    const { passwordHash: _, ...obj } = doc.toObject();
    return obj;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async touchLastLogin(id: string | Types.ObjectId) {
    await this.userModel.findByIdAndUpdate(id, { lastLogin: new Date() });
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async remove(id: string) {
    await this.userModel.findByIdAndDelete(id);
  }

  async me(userId: string | Types.ObjectId) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async updateMe(userId: string | Types.ObjectId, input: UpdateMeInput) {
    const updates: UpdateQuery<UserDocument> = {} as UpdateQuery<UserDocument>;

    if (input.username !== undefined) {
      updates.username = input.username;
    }
    if (input.email !== undefined) {
      updates.email = input.email;
    }
    if (input.password !== undefined) {
      // Hash password with Argon2 before updating
      updates.passwordHash = await argon2.hash(input.password);
    }

    const user = await this.userModel
      .findByIdAndUpdate(userId, updates, { new: true })
      .lean();
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async getProgress(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    // Get badges from Badge collection
    const Badge = this.userModel.db.model('Badge');
    const badges = await Badge.find().lean();

    return {
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      badges: badges,
    };
  }
}
