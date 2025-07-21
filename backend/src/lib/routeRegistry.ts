import { RouteHandler } from "@/types/core";


export default class RouteRegistry {
    /*
        Singleton for storing registered routes in the app.
    */

    private static instance: RouteRegistry;
    private routeHandlers: Map<string, RouteHandler> = new Map();

    private constructor() {}

    static getInstance(): RouteRegistry {
        if (!RouteRegistry.instance) {
        RouteRegistry.instance = new RouteRegistry();
        }
        return RouteRegistry.instance;
    }

    registerRouteHandler(path: string, method: string, handler: RouteHandler): void {
        const key = this.constructKey(path, method);

        if (this.routeHandlers.has(key)) {
            throw new Error(`Route "${key}" is already registered.`);
        }

        this.routeHandlers.set(key, handler);
    }

    getRouteHandler(path: string, method: string): RouteHandler | undefined {
        const key = this.constructKey(path, method);
        return this.routeHandlers.get(key);
    }

    private constructKey(path: string, method: string): string {
        return `${method.toUpperCase()}_${path}`;
    }
}
