import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';

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
    const doc = await this.taskModel.findByIdAndUpdate(
      taskId,
      { done: true, completedAt: new Date() },
      { new: true },
    );
    if (!doc) throw new NotFoundException('Tâche introuvable');
    return doc.toObject();
  }
}
