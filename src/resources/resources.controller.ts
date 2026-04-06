import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post('studies/:studyId/resources')
  @UseGuards(JwtAuthGuard)
  create(@Body() createResourceDto: CreateResourceDto, @GetUser('id') userId: string, @Param('studyId') studyId: string) {
    return this.resourcesService.create(createResourceDto, userId, studyId);
  }

  @Get('studies/:studyId/resources')
  @UseGuards(JwtAuthGuard)
  findAll(@Param('studyId') studyId: string) {
    return this.resourcesService.findAllResourcesByStudy(studyId);
  }

  @Patch('resources/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
    return this.resourcesService.update(id, updateResourceDto);
  }

  @Get('resources/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

 
}
