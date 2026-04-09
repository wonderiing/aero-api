import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) { }

  @Post('studies/:studyId/resources')
  @UseGuards(JwtAuthGuard)
  create(@Body() createResourceDto: CreateResourceDto, @GetUser('id') userId: string, @Param('studyId', ParseUUIDPipe) studyId: string) {
    return this.resourcesService.create(createResourceDto, userId, studyId);
  }

  @Get('studies/:studyId/resources')
  @UseGuards(JwtAuthGuard)
  findAll(@Param('studyId', ParseUUIDPipe) studyId: string, @GetUser('id') userId: string) {
    return this.resourcesService.findAllResourcesByStudy(studyId, userId);
  }

  @Patch('resources/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateResourceDto: UpdateResourceDto, @GetUser('id') userId: string) {
    return this.resourcesService.update(id, updateResourceDto, userId);
  }

  @Get('resources/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser('id') userId: string) {
    return this.resourcesService.findOne(id, userId);
  }

  @Delete('resources/:id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', ParseUUIDPipe) id: string, @GetUser('id') userId: string) {
    return this.resourcesService.remove(id, userId)
   }


}
