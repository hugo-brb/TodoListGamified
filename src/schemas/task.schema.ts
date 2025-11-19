import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class Task {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 'general' })
  category: string;

  @Prop({ default: false })
  done: boolean;

  @Prop({ default: 10 })
  points: number;

  @Prop({ type: Date })
  deadline?: Date;

  @Prop({ type: Date, default: null })
  completedAt: Date | null;

  createdAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
