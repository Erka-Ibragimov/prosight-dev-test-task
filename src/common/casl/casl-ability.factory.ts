import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { RoleUser } from '../enums';
import { CurrentUser } from '../types';

export enum Action {
  Read = 'read',
  Sideload = 'sideload',
  UseLimitedRegions = 'useLimitedRegions',
}

export type Subject = 'Locus';
export type AppAbility = MongoAbility<[Action, Subject]>;

@Injectable()
export class CaslAbilityFactory {
  public createForUser(user: CurrentUser): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    can(Action.Read, 'Locus');

    if (user.role === RoleUser.ADMIN) {
      can(Action.Sideload, 'Locus');
      return build();
    }

    if (user.role === RoleUser.LIMITED) {
      can(Action.Sideload, 'Locus');
      can(Action.UseLimitedRegions, 'Locus');
    }

    return build();
  }
}
