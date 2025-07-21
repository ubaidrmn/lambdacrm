import { RouteDecoratorOptions } from "@/types/core";
import RouteRegistry from "@/lib/routeRegistry";

export function Route(options: RouteDecoratorOptions): Function {
  return function (target: Function) {
    const registry = RouteRegistry.getInstance();
    const path = options.method + '_' + options.path
    registry.addRoute(path, target);
  }
}
