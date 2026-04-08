import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import {
  GetLocusDto,
  LocusSortField,
  SideloadEnum,
  SortOrder,
} from './dto/get-locus.dto';
import { RncLocus } from '../../entities/rnc-locus.entity';
import { RncLocusMember } from '../../entities/rnc-locus-member.entity';
import { CurrentUser } from '../../common/types';
import { defaultLimit } from '../../common/constants';
import { Action, AppAbility, CaslAbilityFactory } from '../../common/casl/casl-ability.factory';

const LOCUS_ORDER_FIELD: Record<LocusSortField, keyof RncLocus> = {
  [LocusSortField.id]: 'id',
  [LocusSortField.memberCount]: 'memberCount',
  [LocusSortField.locusStart]: 'locusStart',
  [LocusSortField.locusStop]: 'locusStop',
};

@Injectable()
export class LocusService {
  constructor(
    @InjectRepository(RncLocus)
    private readonly rncLocusRepository: Repository<RncLocus>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  private static readonly limitedRegionIds = [86118093, 86696489, 88186467];

  public async getLocus(user: CurrentUser, query: GetLocusDto) {
    const ability = this.caslAbilityFactory.createForUser(user);
    this.validateAccessByRole(ability, query);

    const regionIds = this.resolveRegionIds(ability, query.regionId);

    const shouldApplyRegionFilter =
      ability.can(Action.UseLimitedRegions, 'Locus') || Boolean(query.regionId?.length);
    const needMemberFilter =
      shouldApplyRegionFilter || Boolean(query.membershipStatus);

    if (needMemberFilter && shouldApplyRegionFilter && regionIds.length === 0) {
      return [];
    }

    const where: FindOptionsWhere<RncLocus> = {
      ...(query.id?.length && { id: In(query.id) }),
      ...(query.assemblyId && { assemblyId: query.assemblyId }),
      ...(needMemberFilter && {
        locusMembers: this.buildMemberWhere(
          shouldApplyRegionFilter ? regionIds : [],
          query.membershipStatus,
        ),
      }),
    };

    const sortField = LOCUS_ORDER_FIELD[query.sortBy ?? LocusSortField.id];
    const sortDir = query.sortOrder ?? SortOrder.ASC;

    const includeMembers = query.sideload === SideloadEnum.locusMembers;

    return this.rncLocusRepository.find({
      where,
      order: { [sortField]: sortDir },
      skip: query.offset ?? 0,
      take: query.limit ?? defaultLimit,
      relations: includeMembers ? { locusMembers: true } : {},
    });
  }

  private buildMemberWhere(
    regionIds: number[],
    membershipStatus?: string,
  ): FindOptionsWhere<RncLocusMember> {
    return {
      ...(regionIds.length && { regionId: In(regionIds) }),
      ...(membershipStatus && { membershipStatus }),
    };
  }

  private validateAccessByRole(ability: AppAbility, query: GetLocusDto): void {
    if (query.sideload && ability.cannot(Action.Sideload, 'Locus')) {
      throw new ForbiddenException('Sideloading is not allowed for this user');
    }

    if (query.regionId?.length && ability.cannot(Action.FilterByRegion, 'Locus')) {
      throw new ForbiddenException('regionId filter is not allowed for this user');
    }

    if (
      query.membershipStatus &&
      ability.cannot(Action.FilterByMembership, 'Locus')
    ) {
      throw new ForbiddenException(
        'membershipStatus filter is not allowed for this user',
      );
    }
  }

  private resolveRegionIds(
    ability: AppAbility,
    queryRegionIds?: number[],
  ): number[] {
    if (ability.cannot(Action.UseLimitedRegions, 'Locus')) {
      return queryRegionIds ?? [];
    }

    if (!queryRegionIds?.length) {
      return LocusService.limitedRegionIds;
    }

    return queryRegionIds.filter((id) =>
      LocusService.limitedRegionIds.includes(id),
    );
  }
}
