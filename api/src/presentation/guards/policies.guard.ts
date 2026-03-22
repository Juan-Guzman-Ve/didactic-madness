import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IPolicyRepository, POLICY_REPOSITORY } from '@app/application';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(POLICY_REPOSITORY) private readonly policyRepository: IPolicyRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPolicies = this.reflector.get<string[]>('policies', context.getHandler());
    
    if (!requiredPolicies || requiredPolicies.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Fetch user policies from database based on roleId
    const userPolicies = await this.policyRepository.findByRoleId(user.roleId);
    const userPolicyNames = userPolicies.map(p => p.name);

    // Check if user has all required policies
    const hasPolicy = requiredPolicies.every(policy => userPolicyNames.includes(policy));

    if (!hasPolicy) {
      throw new ForbiddenException('User does not have required permissions');
    }

    return true;
  }
}
