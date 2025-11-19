import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChallengeDocument = HydratedDocument<Challenge>;

@Schema()
export class Challenge {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true })
  date: Date;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
