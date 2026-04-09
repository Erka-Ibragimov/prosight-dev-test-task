import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocusMemberResponseDto {
  @ApiProperty({ example: 1001 })
  regionId!: number;

  @ApiProperty({ type: Number, nullable: true, example: 86118093 })
  locusId!: number | null;

  @ApiProperty({ example: 1001 })
  locusMemberId!: number;

  @ApiProperty({ type: String, nullable: true })
  ursTaxid!: string | null;

  @ApiProperty({ type: String, nullable: true, example: 'member' })
  membershipStatus!: string | null;
}

export class LocusItemResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ type: String, nullable: true })
  assemblyId!: string | null;

  @ApiProperty({ type: String, nullable: true })
  locusName!: string | null;

  @ApiProperty({ type: String, nullable: true })
  publicLocusName!: string | null;

  @ApiProperty({ type: String, nullable: true })
  chromosome!: string | null;

  @ApiProperty({ type: String, nullable: true })
  strand!: string | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Bigint serialized for JSON' })
  locusStart!: number | string | bigint | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Bigint serialized for JSON' })
  locusStop!: number | string | bigint | null;

  @ApiProperty({ type: Number, nullable: true })
  memberCount!: number | null;

  @ApiPropertyOptional({ type: [LocusMemberResponseDto] })
  locusMembers?: LocusMemberResponseDto[];
}
