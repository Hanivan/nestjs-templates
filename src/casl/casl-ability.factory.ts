import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { ConflictException, Injectable } from '@nestjs/common';
import { uniq } from 'lodash';
import { Action } from './types/action.enum';
import { Subject } from './types/subject.enum';

export type AppAbility = Ability<[Action, Subject]>;

// {
//   sub: 1,
//   email: 'me@hanivan.my.id',
//   permissions: [
//     { action: 'create', object_id: 1, active: 1 },
//     { action: 'read', object_id: 1, active: 1 },
//     { action: 'update', object_id: 1, active: 1 },
//     { action: 'delete', object_id: 1, active: 1 },
//     { action: 'validate', object_id: 1, active: 1 }
//   ],
//   objects: [ { name: 'media' } ],
//   iat: 1674802248,
//   exp: 1674803148
// }

interface PermissionUser {
  action: string;
  object_id: number;
  active: number;
}

interface ObjectPermissionUser {
  name: string;
}

interface JwtUser {
  sub: number;
  email: string;
  permissions: Array<PermissionUser>;
  objects: Array<ObjectPermissionUser>;
}

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: JwtUser) {
    let userCan: string[] = [];
    let userCant: string[] = [];
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subject]>
    >(Ability as AbilityClass<AppAbility>);

    console.log(user);
    console.log(!user.permissions);
    console.log(!user.objects);

    if (!user.permissions && !user.objects) {
      throw new ConflictException('role user not found');
    }

    // will fix type
    for (const permission of user.permissions) {
      for (const object of user.objects) {
        if (permission.active) {
          userCan.push(`${permission.action}-${object.name}`);
        } else {
          userCant.push(`${permission.action}-${object.name}`);
        }
      }
    }
    userCan = uniq(userCan);
    userCant = uniq(userCant).filter((it) => !userCan.includes(it));

    for (const uCan of userCan) {
      const [action, subject] = uCan.split('-');
      can(action as Action, subject as Subject);
    }
    for (const uCant of userCant) {
      const [action, subject] = uCant.split('-');
      cannot(action as Action, subject as Subject);
    }

    return build();
  }
}
