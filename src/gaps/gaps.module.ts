import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GapsService } from './gaps.service';
import { GapsController } from './gaps.controller';
import { Attempt } from 'src/attempts/entities/attempt.entity';
import { StudiesModule } from 'src/studies/studies.module';

@Module({
    controllers: [GapsController],
    providers: [GapsService],
    imports: [
        TypeOrmModule.forFeature([Attempt]),
        StudiesModule,
    ],
})
export class GapsModule {}
