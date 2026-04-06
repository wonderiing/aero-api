import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { Repository } from 'typeorm';
import { StudiesService } from 'src/studies/studies.service';

@Injectable()
export class ResourcesService {

  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepo: Repository<Resource>,
    private readonly studiesService: StudiesService,
  ) {}

  async create(createResourceDto: CreateResourceDto, userId: string, studyId: string): Promise<Resource> {
    
    const study = await this.studiesService.findOne(studyId, userId)

    const newResource = this.resourceRepo.create({
      ...createResourceDto,
      study
    })

    return await this.resourceRepo.save(newResource)
    
  }

  async findAllResourcesByStudy(studyId: string): Promise<Resource[]> {
    
    const resources = await this.resourceRepo.find({where: {study: { id: studyId}}})

    if (!resources || resources.length === 0) throw new BadRequestException(`No resources found for that study`)

    return resources;
  }

  async findOne(id: string): Promise<Resource> {
    const resource = await this.resourceRepo.findOne({ where: { id } });
    if (!resource) throw new BadRequestException(`Resource with id ${id} not found`);
    return resource;
  }

  async update(id: string, updateResourceDto: UpdateResourceDto): Promise<Resource> {
    const resource = await this.resourceRepo.preload({
      id,
      ...updateResourceDto,
    });

    if (!resource) throw new BadRequestException(`Resource with id ${id} not found`);

    return this.resourceRepo.save(resource);
  }

  remove(id: string) {
    return `This action removes a #${id} resource`;
  }
}
