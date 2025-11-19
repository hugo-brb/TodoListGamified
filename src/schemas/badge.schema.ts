import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BadgeDocument = HydratedDocument<Badge>;

@Schema()
export class Badge {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  condition: string;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
