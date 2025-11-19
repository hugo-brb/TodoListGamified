import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserBadgeDocument = HydratedDocument<UserBadge>;

@Schema({ timestamps: { createdAt: 'earnedAt', updatedAt: false } })
export class UserBadge {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Badge', required: true })
  badgeId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  earnedAt: Date;
}

export const UserBadgeSchema = SchemaFactory.createForClass(UserBadge);

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });
