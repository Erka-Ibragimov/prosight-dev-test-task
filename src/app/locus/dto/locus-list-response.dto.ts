import { ApiProperty } from '@nestjs/swagger';
import { LocusItemResponseDto } from './locus-item-response.dto';

export class LocusListResponseDto {
  @ApiProperty({ example: 42, description: 'Total rows matching filters (for page count)' })
  total!: number;

  @ApiProperty({
    example: 1,
    description: '1-based page number derived from offset and limit',
  })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ type: [LocusItemResponseDto] })
  data!: LocusItemResponseDto[];
}
