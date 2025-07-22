import { RouteDecoratorOptions, RouteHandler } from "@/models/core";
import RouteRegistry from "@/lib/route-registry";

export function Route(options: RouteDecoratorOptions): Function {
  return function (target: RouteHandler) {
    const registry = RouteRegistry.getInstance();
    registry.registerRouteHandler(options, target);
  }
}
