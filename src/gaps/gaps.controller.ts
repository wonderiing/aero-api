import { Controller, Get, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { GapsService } from './gaps.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('')
export class GapsController {

    constructor(private readonly gapsService: GapsService) {}

    @Get('studies/:studyId/gaps')
    @UseGuards(JwtAuthGuard)
    getGaps(
        @Param('studyId', ParseUUIDPipe) studyId: string,
        @GetUser('id') userId: string,
    ) {
        return this.gapsService.getGaps(studyId, userId);
    }
}
