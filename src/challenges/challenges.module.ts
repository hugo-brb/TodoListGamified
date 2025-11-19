import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Challenge, ChallengeSchema } from '../schemas/challenge.schema';
import {
  UserChallenge,
  UserChallengeSchema,
} from '../schemas/user-challenge.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      { name: UserChallenge.name, schema: UserChallengeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
