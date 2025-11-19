import { Module } from '@nestjs/common';
import { BadgesController } from './badges.controller';
import { BadgesService } from './badges.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Badge, BadgeSchema } from '../schemas/badge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Badge.name, schema: BadgeSchema }]),
  ],
  controllers: [BadgesController],
  providers: [BadgesService],
})
export class BadgesModule {}
