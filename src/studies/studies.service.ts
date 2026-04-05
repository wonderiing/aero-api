import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Study } from './entities/study.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { StudyDto } from './dto/study.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class StudiesService {

  private readonly logger = new Logger(StudiesService.name);

  constructor(
    @InjectRepository(Study)
    private readonly studyRepo: Repository<Study>
  ) {}

  async create(createStudyDto: CreateStudyDto, user: User): Promise<StudyDto> {
    
    try { 
      
      const newStudy = await this.studyRepo.create({
        ...createStudyDto,
        user
      })

      const {id, title, description} = await this.studyRepo.save(newStudy);
      return { id, title, description } 

    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  findAll(paginationDto: PaginationDto, userId: string): Promise<Study[]> {

    const { limit = 10, offset = 0} = paginationDto;


    const studies = this.studyRepo.find({
      where: { user: { id: userId}},
      take: limit,
      skip: offset
    })
    
    return studies;
  }

  async findOne(studyId: string, userId: string): Promise<Study> {

    const study = await this.studyRepo.findOne(
     {where: {id: studyId, user: { id: userId}}}
    )
    if (!study) throw new BadRequestException(`Study with id ${studyId} not found`)

    return study;
    
  }

  
  async remove(studyId: string, userId: string): Promise<void> {

    const study = await this.findOne(studyId, userId);
    await this.studyRepo.remove(study);
    
  }

  // pendiente
  update(id: number, updateStudyDto: UpdateStudyDto) {
    return `This action updates a #${id} study`;
  }

}
