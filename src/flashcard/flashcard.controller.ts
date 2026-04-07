import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashcardService) { }

  @Get('studies/:studyId/flashcards')
  @UseGuards(JwtAuthGuard)
  async findAllFlaschardByStudy(@Param('studyId', ParseUUIDPipe) studyId: string, @GetUser('id') userId: string, @Param('resourceId') resourceId?: string) {
    return this.flashcardService.findAllFlashcardByStudy(studyId, userId, resourceId);
  }

  @Get('studies/:studyId/flashcards/review-queue')
  @UseGuards(JwtAuthGuard)
  async getReviewQueue(@Param('studyId', ParseUUIDPipe) studyId: string, @GetUser('id') userId: string) {
    return this.flashcardService.getReviewQueue(studyId, userId);
  }

  @Post('studies/:studyId/flashcards')
  @UseGuards(JwtAuthGuard)
  async create(@Param('studyId', ParseUUIDPipe) studyId: string, @GetUser('id') userId: string, @Body() createFlashCardDto: CreateFlashcardDto) {
    return this.flashcardService.create(createFlashCardDto, studyId, userId)
  }

  @Post('studies/:studyId/flashcards/batch')
  @UseGuards(JwtAuthGuard)
  async createBatch(@Body() createFlashCardDto: CreateFlashcardDto[], @GetUser('id') userId: string, @Param('studyId', ParseUUIDPipe) studyId: string) {
    return this.flashcardService.createBatch(createFlashCardDto, studyId, userId);
  }

}
