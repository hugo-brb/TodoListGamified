import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { SeedService } from './seed.service';
import { User, UserSchema } from '../schemas/user.schema';
import { Task, TaskSchema } from '../schemas/task.schema';
import { Badge, BadgeSchema } from '../schemas/badge.schema';
import { Challenge, ChallengeSchema } from '../schemas/challenge.schema';
import { UserBadge, UserBadgeSchema } from '../schemas/user-badge.schema';
import {
  UserChallenge,
  UserChallengeSchema,
} from '../schemas/user-challenge.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): MongooseModuleOptions => {
        const explicit = config.get<string>('MONGO_URI');
        if (explicit) {
          return { uri: explicit };
        }
        const host =
          config.get<string>('MONGO_HOST') ||
          config.get<string>('MONGO_INITDB_HOST') ||
          'localhost';
        const port = config.get<string>('MONGO_PORT') || '27017';
        const db =
          config.get<string>('MONGO_INITDB_DATABASE') ||
          config.get<string>('MONGO_DB') ||
          'gamified_todo';

        const user =
          config.get<string>('MONGO_INITDB_ROOT_USERNAME') ||
          config.get<string>('MONGO_USER');
        const pass =
          config.get<string>('MONGO_INITDB_ROOT_PASSWORD') ||
          config.get<string>('MONGO_PASSWORD');

        const credentials = user
          ? `${encodeURIComponent(user)}:${encodeURIComponent(pass ?? '')}@`
          : '';

        const uri = `mongodb://${credentials}${host}:${port}/${db}${user ? '?authSource=admin' : ''}`;

        return { uri };
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Badge.name, schema: BadgeSchema },
      { name: Challenge.name, schema: ChallengeSchema },
      { name: UserBadge.name, schema: UserBadgeSchema },
      { name: UserChallenge.name, schema: UserChallengeSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
