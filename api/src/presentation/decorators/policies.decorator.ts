import { SetMetadata } from '@nestjs/common';

export const RequirePolicies = (...policies: string[]) => SetMetadata('policies', policies);
