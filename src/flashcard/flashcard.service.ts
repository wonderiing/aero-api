import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flashcard } from './entities/flashcard.entity';
import { IsNull, LessThanOrEqual, Repository } from 'typeorm';
import { StudiesService } from 'src/studies/studies.service';
import { ResourcesService } from 'src/resources/resources.service';

@Injectable()
export class FlashcardService {

  constructor(
    @InjectRepository(Flashcard)
    private readonly flashcardRepo: Repository<Flashcard>,
    private readonly studiesService: StudiesService,
    private readonly resourcesService: ResourcesService
  ) { }


  async findAllFlashcardByStudy(studyId: string, userId: string, resourceId?: string): Promise<Flashcard[]> {

    const query = this.flashcardRepo.createQueryBuilder('flashcard')
      .innerJoin('flashcard.study', 'study')
      .innerJoin('study.user', 'user')
      .where('study.id = :studyId', { studyId })
      .andWhere('user.id = :userId', { userId });

    if (resourceId) {
      query.andWhere('flashcard.resource.id = :resourceId', { resourceId });
    }

    const flashcards = await query.getMany();

    if (!flashcards.length) throw new BadRequestException(`No flashcards found for study ${studyId}`);

    return flashcards;
  }

  async findOne(id: string, userId: string): Promise<Flashcard> {

    const flashcard = await this.flashcardRepo.findOne({ where: { id, study: { user: { id: userId } } }, relations: { study: true, resource: true } })

    if (!flashcard) throw new BadRequestException(`Flashcard with id ${id} not found`)

    return flashcard;
  }

  async create(createFlashcardDto: CreateFlashcardDto, studyId: string, userId: string): Promise<Flashcard> {


    const { resourceId, ...flashcardData } = createFlashcardDto

    const resource = await this.resourcesService.findOne(resourceId, userId)

    if (!resource) throw new BadRequestException(`Resource not found`)

    const study = await this.studiesService.findOne(studyId, userId)

    if (!study) throw new BadRequestException(`Study not found`)

    const newFlashcard = this.flashcardRepo.create({
      ...flashcardData,
      study,
      resource
    })

    return await this.flashcardRepo.save(newFlashcard)

  }

  async createBatch(createFlashCardDto: CreateFlashcardDto[], studyId: string, userId: string): Promise<Flashcard[]> {

    const study = await this.studiesService.findOne(studyId, userId)
    const uniqueResourceIds = [...new Set(createFlashCardDto.map(dto => dto.resourceId))];

    const resources = await Promise.all(
      uniqueResourceIds.map(id => this.resourcesService.findOne(id, userId))
    );

    const resourceMap = new Map(resources.map(r => [r.id, r]));

    const flashcards = createFlashCardDto.map(({ resourceId, ...flashcardData }) => {
      return this.flashcardRepo.create({
        ...flashcardData,
        study,
        resource: resourceMap.get(resourceId),
      });
    });

    return await this.flashcardRepo.save(flashcards);
  }

  async getReviewQueue(studyId: string, userId: string): Promise<Flashcard[]> {

    const now = new Date();

    const flashcards = await this.flashcardRepo.find({
      where: [
        {
          study: { id: studyId, user: { id: userId } },
          nextReviewAt: LessThanOrEqual(now),
        },
        {
          study: { id: studyId, user: { id: userId } },
          nextReviewAt: IsNull(),
        },
      ],
      order: { nextReviewAt: { direction: 'ASC', nulls: 'FIRST' } },
    });

    return flashcards;
  }

}
