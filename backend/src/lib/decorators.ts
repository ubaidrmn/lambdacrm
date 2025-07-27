import { RegisterRouteOptions, RouteHandler } from "@/types/core";
import RouteRegistry from "@/lib/route.registry";

export function RegisterRoute(options: RegisterRouteOptions): Function {
  return function (handler: RouteHandler) {
    const registry = RouteRegistry.getInstance();
    registry.register(options, handler)
    return handler;
  }
}
