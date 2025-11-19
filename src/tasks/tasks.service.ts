import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { UsersService } from '../users/users.service';
import { BadgesService } from '../badges/badges.service';

interface ListParams {
  userId: Types.ObjectId;
  limit?: number;
  offset?: number;
  category?: string;
}

interface CreateTaskInput {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  category?: string;
  deadline?: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  category?: string;
  done?: boolean;
  deadline?: string;
}

interface TaskQuery {
  userId: Types.ObjectId;
  category?: string;
}

interface TaskUpdateData {
  title?: string;
  description?: string;
  category?: string;
  done?: boolean;
  deadline?: Date;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly usersService: UsersService,
    private readonly badgesService: BadgesService,
  ) {}

  async list(params: ListParams) {
    const query: TaskQuery = { userId: params.userId };
    if (params.category) query.category = params.category;
    return this.taskModel
      .find(query)
      .skip(params.offset ?? 0)
      .limit(params.limit ?? 0)
      .lean();
  }

  async create(input: CreateTaskInput) {
    const doc = await this.taskModel.create({
      userId: input.userId,
      title: input.title,
      description: input.description ?? '',
      category: input.category ?? 'general',
      deadline: input.deadline ? new Date(input.deadline) : undefined,
    });
    return doc.toObject();
  }

  async update(taskId: string, input: UpdateTaskInput) {
    const update: TaskUpdateData = {
      title: input.title,
      description: input.description,
      category: input.category,
      done: input.done,
    };
    if (input.deadline !== undefined) {
      update.deadline = input.deadline ? new Date(input.deadline) : undefined;
    }
    const doc = await this.taskModel.findByIdAndUpdate(taskId, update, {
      new: true,
    });
    if (!doc) throw new NotFoundException('Tâche introuvable');
    return doc.toObject();
  }

  async remove(taskId: string) {
    await this.taskModel.findByIdAndDelete(taskId);
  }

  async complete(taskId: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Tâche introuvable');

    // Don't award XP if already completed
    if (task.done) {
      return task.toObject();
    }

    // Mark task as completed
    task.done = true;
    task.completedAt = new Date();
    await task.save();

    const userId = task.userId;
    const xpAmount = task.points || 10;

    // Award XP and calculate level
    const { newXP, newLevel, leveledUp } = await this.usersService.awardXP(
      userId,
      xpAmount,
    );

    // Update streak
    const { streak, longestStreak, streakBroken } =
      await this.usersService.updateStreak(userId);

    // Check and award badges
    const newBadges = await this.badgesService.checkAndAwardBadges(userId);

    return {
      task: task.toObject(),
      gamification: {
        xpGained: xpAmount,
        newXP,
        newLevel,
        leveledUp,
        streak,
        longestStreak,
        streakBroken,
        newBadges,
      },
    };
  }
}
