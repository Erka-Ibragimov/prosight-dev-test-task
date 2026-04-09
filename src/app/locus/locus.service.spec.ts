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
import { toLocusItemResponse } from './locus.mapper';

describe('LocusService', () => {
  let service: LocusService;
  const locusFindMock = jest.fn();
  const locusCountMock = jest.fn();

  beforeEach(async () => {
    locusFindMock.mockReset();
    locusCountMock.mockReset();
    locusFindMock.mockResolvedValue([]);
    locusCountMock.mockResolvedValue(0);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocusService,
        CaslAbilityFactory,
        {
          provide: getRepositoryToken(RncLocus),
          useValue: {
            find: locusFindMock,
            count: locusCountMock,
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
    const rows = [
      {
        id: 1,
        assemblyId: null,
        locusName: null,
        publicLocusName: null,
        chromosome: null,
        strand: null,
        locusStart: null,
        locusStop: null,
        memberCount: null,
        locusMembers: [
          {
            regionId: 86118093,
            locusId: 1,
            locusMemberId: 100,
            ursTaxid: null,
            membershipStatus: 'member',
          },
        ],
      },
    ] as RncLocus[];
    locusFindMock.mockResolvedValue(rows);
    locusCountMock.mockResolvedValue(10);

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

    expect(result).toEqual({
      total: 10,
      page: 1,
      limit: 5,
      data: rows.map(toLocusItemResponse),
    });
    expect(locusCountMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: expect.anything(),
          assemblyId: 'GRCh38',
          locusMembers: expect.objectContaining({
            regionId: expect.anything(),
            membershipStatus: 'member',
          }),
        }),
      }),
    );
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

  it('allows normal user to filter by regionId and membershipStatus (no sideload)', async () => {
    await service.getLocus(
      { login: 'normal', role: RoleUser.NORMAL },
      { regionId: [86118093], membershipStatus: 'member' },
    );

    expect(locusFindMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          locusMembers: expect.objectContaining({
            regionId: expect.anything(),
            membershipStatus: 'member',
          }),
        }),
        relations: {},
      }),
    );
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
    expect(locusCountMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      total: 0,
      page: 1,
      limit: defaultLimit,
      data: [],
    });
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
