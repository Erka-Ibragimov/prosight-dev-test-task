import { RncLocus } from '../../entities/rnc-locus.entity';
import { RncLocusMember } from '../../entities/rnc-locus-member.entity';
import {
  LocusItemResponseDto,
  LocusMemberResponseDto,
} from './dto/locus-item-response.dto';

export function toLocusMemberResponse(
  member: RncLocusMember,
): LocusMemberResponseDto {
  return {
    regionId: member.regionId,
    locusId: member.locusId,
    locusMemberId: member.locusMemberId,
    ursTaxid: member.ursTaxid,
    membershipStatus: member.membershipStatus,
  };
}

export function toLocusItemResponse(locus: RncLocus): LocusItemResponseDto {
  const dto: LocusItemResponseDto = {
    id: locus.id,
    assemblyId: locus.assemblyId ?? null,
    locusName: locus.locusName ?? null,
    publicLocusName: locus.publicLocusName ?? null,
    chromosome: locus.chromosome ?? null,
    strand: locus.strand ?? null,
    locusStart: locus.locusStart ?? null,
    locusStop: locus.locusStop ?? null,
    memberCount: locus.memberCount ?? null,
  };

  if (locus.locusMembers?.length) {
    dto.locusMembers = locus.locusMembers.map(toLocusMemberResponse);
  }

  return dto;
}
