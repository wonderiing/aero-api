import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Throttle, ThrottlerModule } from '@nestjs/throttler';
import { StudiesModule } from './studies/studies.module';
import { ResourcesModule } from './resources/resources.module';
import { FlashcardModule } from './flashcard/flashcard.module';

@Module({
  imports: [AuthModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT!,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,

    }),

    ThrottlerModule.forRoot({
      throttlers: [
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
      ]
    }),

    StudiesModule,

    ResourcesModule,

    FlashcardModule

  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
