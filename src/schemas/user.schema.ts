import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: 0 })
  xp: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  streak: number;

  @Prop({ default: 0 })
  longestStreak: number;

  @Prop()
  lastLogin?: Date;

  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
