import { Controller, Get, Post, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('')
export class AttemptsController {

    constructor(private readonly attemptsService: AttemptsService) {}

    @Post('flashcards/:flashcardId/attempts')
    @UseGuards(JwtAuthGuard)
    create(
        @Param('flashcardId', ParseUUIDPipe) flashcardId: string,
        @Body() createAttemptDto: CreateAttemptDto,
        @GetUser('id') userId: string,
    ) {
        return this.attemptsService.create(createAttemptDto, flashcardId, userId);
    }

    @Get('studies/:studyId/attempts')
    @UseGuards(JwtAuthGuard)
    findAllByStudy(
        @Param('studyId', ParseUUIDPipe) studyId: string,
        @GetUser('id') userId: string,
    ) {
        return this.attemptsService.findAllByStudy(studyId, userId);
    }
}
