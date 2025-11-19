import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserChallengeDocument = HydratedDocument<UserChallenge>;

@Schema({ timestamps: { createdAt: 'completedAt', updatedAt: false } })
export class UserChallenge {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Challenge', required: true })
  challengeId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  completedAt: Date;

  @Prop({ default: 0 })
  pointsEarned: number;
}

export const UserChallengeSchema = SchemaFactory.createForClass(UserChallenge);

UserChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
