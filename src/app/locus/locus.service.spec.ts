import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { defaultLimit } from '../../common/constants';
import { RoleUser } from '../../common/enums';
import { RncLocus } from '../../entities/rnc-locus.entity';
import {
  LocusSortField,
  SideloadEnum,
  SortOrder,
} from './dto/get-locus.dto';
import { LocusService } from './locus.service';
import { CaslAbilityFactory } from '../../common/casl/casl-ability.factory';

describe('LocusService', () => {
  let service: LocusService;
  const locusFindMock = jest.fn();

  beforeEach(async () => {
    locusFindMock.mockReset();
    locusFindMock.mockResolvedValue([]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocusService,
        CaslAbilityFactory,
        {
          provide: getRepositoryToken(RncLocus),
          useValue: {
            find: locusFindMock,
          },
        },
      ],
    }).compile();

    service = module.get<LocusService>(LocusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('applies all admin filters, sorting, paging and sideload relation', async () => {
    const expectedResult = [{ id: 1 }];
    locusFindMock.mockResolvedValue(expectedResult);

    const result = await service.getLocus(
      { login: 'admin', role: RoleUser.ADMIN },
      {
        id: [1, 2],
        assemblyId: 'GRCh38',
        sideload: SideloadEnum.locusMembers,
        regionId: [86118093],
        membershipStatus: 'member',
        sortBy: LocusSortField.memberCount,
        sortOrder: SortOrder.DESC,
        limit: 5,
        offset: 2,
      },
    );

    expect(result).toEqual(expectedResult);
    expect(locusFindMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: expect.anything(),
          assemblyId: 'GRCh38',
          locusMembers: expect.objectContaining({
            regionId: expect.anything(),
            membershipStatus: 'member',
          }),
        }),
        order: { memberCount: SortOrder.DESC },
        skip: 2,
        take: 5,
        relations: { locusMembers: true },
      }),
    );
  });

  it('rejects sideload for normal user', async () => {
    await expect(
      service.getLocus(
        { login: 'normal', role: RoleUser.NORMAL },
        { sideload: SideloadEnum.locusMembers },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(locusFindMock).not.toHaveBeenCalled();
  });

  it('rejects region and membership filters for normal user', async () => {
    await expect(
      service.getLocus(
        { login: 'normal', role: RoleUser.NORMAL },
        { regionId: [86118093], membershipStatus: 'member' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(locusFindMock).not.toHaveBeenCalled();
  });

  it('uses default limited region list when limited user passes no regionId', async () => {
    await service.getLocus(
      { login: 'limited', role: RoleUser.LIMITED },
      {},
    );

    expect(locusFindMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          locusMembers: expect.objectContaining({
            regionId: expect.anything(),
          }),
        }),
        relations: {},
        take: defaultLimit,
        skip: 0,
      }),
    );
  });

  it('filters limited user regionIds to allowed subset', async () => {
    await service.getLocus(
      { login: 'limited', role: RoleUser.LIMITED },
      { regionId: [86118093, 111] },
    );

    expect(locusFindMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          locusMembers: expect.objectContaining({
            regionId: expect.anything(),
          }),
        }),
      }),
    );
  });

  it('returns no rows for limited user with disallowed regionId filter', async () => {
    const result = await service.getLocus(
      { login: 'limited', role: RoleUser.LIMITED },
      { regionId: [111] },
    );

    expect(locusFindMock).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('does not apply member filter when admin has no regionId and membershipStatus', async () => {
    await service.getLocus(
      { login: 'admin', role: RoleUser.ADMIN },
      {
        sortBy: LocusSortField.locusStart,
        sortOrder: SortOrder.ASC,
      },
    );

    expect(locusFindMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        order: { locusStart: SortOrder.ASC },
        relations: {},
      }),
    );
  });
});
