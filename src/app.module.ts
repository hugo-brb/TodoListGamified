import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { BadgesModule } from './badges/badges.module';
import { ChallengesModule } from './challenges/challenges.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [() => ({ PORT: process.env.PORT || 3000 })],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    TasksModule,
    BadgesModule,
    ChallengesModule,
    LeaderboardModule,
    CategoriesModule,
  ],
})
export class AppModule {}
