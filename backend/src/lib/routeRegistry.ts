import { RouteMethod } from "@/types/core";

export default class RouteRegistry {
  private static instance: RouteRegistry;
  private routes: Record<string, Function> = {};

  private constructor() {}

  static getInstance(): RouteRegistry {
    if (!RouteRegistry.instance) {
      RouteRegistry.instance = new RouteRegistry();
    }
    return RouteRegistry.instance;
  }

  addRoute(key: string, handler: Function): void {
    this.routes[key] = handler;
  }

  getRoute(key: string): Function {
    return this.routes[key];
  }

  constructKey(path: string, method: string): string {
    return method.toUpperCase() + '_' + path;
  }
}
