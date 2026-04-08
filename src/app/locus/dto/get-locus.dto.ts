import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { NumberArrayQueryParam } from '../../../common/decorators/number-array-query.decorator';

export enum SideloadEnum {
  locusMembers = 'locusMembers',
}

export enum LocusSortField {
  id = 'id',
  memberCount = 'memberCount',
  locusStart = 'locusStart',
  locusStop = 'locusStop',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetLocusDto {
  @ApiPropertyOptional({
    type: [Number],
    description: 'Filter by locus IDs',
    example: [1, 2],
  })
  @NumberArrayQueryParam()
  id?: number[];

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by assembly id',
    example: 'GRCh38',
  })
  @IsOptional()
  @IsString()
  assemblyId?: string;

  @ApiPropertyOptional({
    type: [Number],
    description: 'Filter by region IDs',
    example: [86118093],
  })
  @NumberArrayQueryParam()
  regionId?: number[];

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by membership status',
    example: 'member',
  })
  @IsOptional()
  @IsString()
  membershipStatus?: string;

  @ApiPropertyOptional({
    enum: SideloadEnum,
    description: 'Include related resources',
  })
  @IsOptional()
  @IsEnum(SideloadEnum)
  sideload?: SideloadEnum;

  @ApiPropertyOptional({
    type: Number,
    description: 'Offset for pagination',
    example: 0,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  offset?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Limit for pagination',
    example: 20,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsPositive()
  limit?: number;

  @ApiPropertyOptional({
    enum: LocusSortField,
    description: 'Field used for sorting',
  })
  @IsOptional()
  @IsEnum(LocusSortField)
  sortBy?: LocusSortField;

  @ApiPropertyOptional({
    enum: SortOrder,
    description: 'Sort direction',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
