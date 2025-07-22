import { RouteDecoratorOptions, RouteHandler } from "@/models/core";
import * as z from "zod";

export default class RouteRegistry {
    /*
        Singleton for storing registered routes in the app.
    */

    private static instance: RouteRegistry;
    private registry: Map<string, { handler: RouteHandler, requestBodySchema?: z.ZodObject}> = new Map();

    private constructor() {}

    static getInstance(): RouteRegistry {
        if (!RouteRegistry.instance) {
            RouteRegistry.instance = new RouteRegistry();
        }
        return RouteRegistry.instance;
    }

    registerRouteHandler(options: RouteDecoratorOptions, handler: RouteHandler): void {
        const { path, method, requestBodySchema } = options;
        const key = this.constructKey(path, method);

        if (this.registry.has(key)) {
            throw new Error(`Route "${key}" is already registered.`);
        }

        this.registry.set(key, { handler, requestBodySchema });
    }

    getRoute(path: string, method: string): { handler: RouteHandler, requestBodySchema?: z.ZodObject } | undefined {
        const key = this.constructKey(path, method);
        const route = this.registry.get(key);
        return route;
    }

    private constructKey(path: string, method: string): string {
        return `${method.toUpperCase()}_${path}`;
    }
}
