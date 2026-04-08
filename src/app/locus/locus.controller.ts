import { Controller, Get, Query } from '@nestjs/common';
import { LocusService } from './locus.service';
import { GetLocusDto } from './dto/get-locus.dto';
import { User } from '../../common/decorators/user.decorator';
import { CurrentUser } from '../../common/types';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RncLocus } from '../../entities/rnc-locus.entity';

@ApiTags('Locus')
@ApiBearerAuth()
@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) {}

  @Get()
  @ApiOperation({ summary: 'Get locus list with filters and sorting' })
  @ApiOkResponse({
    description: 'Returns list of locus records',
    type: RncLocus,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Invalid query or forbidden filter set' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token' })
  public async getLocus(
    @User() user: CurrentUser,
    @Query() query: GetLocusDto,
  ) {
    return this.locusService.getLocus(user, query);
  }
}
