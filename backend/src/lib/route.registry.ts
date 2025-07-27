import { AppRoute, RegisterRouteOptions, RouteHandler, RouteMethod } from "@/types/core";
import * as z from "zod";
import { AppError } from "./errors";

export default class RouteRegistry {
    /*
        Singleton for storing registered routes in the app.
    */

    private static instance: RouteRegistry;
    private routes: AppRoute[] = [];

    public constructor() {}

    static getInstance(): RouteRegistry {
        if (!RouteRegistry.instance) {
            RouteRegistry.instance = new RouteRegistry();
        }
        return RouteRegistry.instance;
    }

    register(options: RegisterRouteOptions, handler: RouteHandler): void {
        this.routes.push({
            pattern: options.pattern,
            method: options.method,
            handler: handler
        })
    }

    get(path: string, method: RouteMethod): AppRoute {
        let route = null;

        this.routes.forEach(_route => {
            const match = path.match(_route.pattern);
            
            if (match !== null && _route.method === method) {
                route = _route;

                if (match.groups) {
                    route.params = match.groups;
                }

                return;
            }
        })

        if (route) { return route; }

        throw new AppError("Route not found!")
    }

    // getRoute(path: string, method: string): { handler: RouteHandler, requestBodySchema?: z.ZodObject } | undefined {
    //     const key = this.constructKey(path, method);
    //     const route = this.registry.get(key);
    //     return route;
    // }

    private constructKey(path: string, method: string): string {
        return `${method.toUpperCase()}_${path}`;
    }
}
