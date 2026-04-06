import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SerializeOptions, Query, ParseUUIDPipe } from '@nestjs/common';
import { StudiesService } from './studies.service';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createStudyDto: CreateStudyDto, @GetUser() user: User) {
    return this.studiesService.create(createStudyDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@GetUser('id', ParseUUIDPipe) userId: string, @Query() paginationDto: PaginationDto) {
    return this.studiesService.findAll(paginationDto, userId);
  }

  @Get(':studyId')
  @UseGuards(JwtAuthGuard)
  getOne(@Param('studyId', ParseUUIDPipe) studyId: string, @GetUser('id') userId: string) {
    return this.studiesService.findOne(studyId, userId)
  }

  @Delete(':studyId')
  @UseGuards(JwtAuthGuard)
  delete(@Param('studyId', ParseUUIDPipe) studyId: string, @GetUser('id') userId: string) {
    return this.studiesService.remove(studyId, userId);
  }


}
