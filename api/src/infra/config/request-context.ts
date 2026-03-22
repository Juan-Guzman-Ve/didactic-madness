import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
  userId?: string;
}

export class RequestContextHolder {
  private static readonly storage = new AsyncLocalStorage<RequestContext>();

  static run<T>(context: RequestContext, fn: () => T): T {
    return this.storage.run(context, fn);
  }

  static getContext(): RequestContext | undefined {
    return this.storage.getStore();
  }

  static getUserId(): string | undefined {
    return this.getContext()?.userId;
  }
}
