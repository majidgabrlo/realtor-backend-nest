import { SetMetadata } from '@nestjs/common';
import { UserType } from 'prisma/prisma-client';

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
