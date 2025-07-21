import { RouteDecoratorOptions, RouteHandler } from "@/types/core";
import RouteRegistry from "@/lib/routeRegistry";

export function Route(options: RouteDecoratorOptions): Function {
  return function (target: RouteHandler) {
    const registry = RouteRegistry.getInstance();
    registry.registerRouteHandler(options.path, options.method, target);
  }
}
