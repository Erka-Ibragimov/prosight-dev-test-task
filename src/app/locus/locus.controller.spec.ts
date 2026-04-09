import { Test, TestingModule } from '@nestjs/testing';
import { LocusController } from './locus.controller';
import { LocusService } from './locus.service';
import { RoleUser } from '../../common/enums';

describe('LocusController', () => {
  let controller: LocusController;
  const getLocusMock = jest.fn();

  beforeEach(async () => {
    getLocusMock.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocusController],
      providers: [
        {
          provide: LocusService,
          useValue: {
            getLocus: getLocusMock,
          },
        },
      ],
    }).compile();

    controller = module.get<LocusController>(LocusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates getLocus call to service with user and query', async () => {
    const user = { login: 'admin', role: RoleUser.ADMIN };
    const query = { limit: 10, offset: 0 };
    const expected = {
      total: 1,
      page: 1,
      limit: 10,
      data: [
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
        },
      ],
    };
    getLocusMock.mockResolvedValue(expected);

    const result = await controller.getLocus(user, query);

    expect(result).toEqual(expected);
    expect(getLocusMock).toHaveBeenCalledWith(user, query);
  });
});
