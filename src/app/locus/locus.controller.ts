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
import { LocusListResponseDto } from './dto/locus-list-response.dto';

@ApiTags('Locus')
@ApiBearerAuth()
@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) {}

  @Get()
  @ApiOperation({ summary: 'Get locus list with filters and sorting' })
  @ApiOkResponse({
    description: 'Paginated list of locus records',
    type: LocusListResponseDto,
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
