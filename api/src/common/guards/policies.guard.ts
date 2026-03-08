import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPolicies = this.reflector.get<string[]>('policies', context.getHandler());
    
    if (!requiredPolicies || requiredPolicies.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // TODO: Check if user has required policies
    // const userPolicies = user.role.policies.map(p => p.name);
    // const hasPolicy = requiredPolicies.every(policy => userPolicies.includes(policy));

    // For now, return true (implement policy checking logic later)
    return true;
  }
}
