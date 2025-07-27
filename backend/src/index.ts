import "@/controllers/lead.controller"; // Load all controllers into RouteRegistry.
import RouteRegistry from "@/lib/route.registry";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as z from "zod"
import { AppError } from "@/lib/errors";
import { AppRouteRequest, RouteMethod } from "./types/core";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const rawBody = event.body;
    event.body = JSON.parse(rawBody || "{}");
    const user = {
        sub: "12345678"
    }

    try {
        const routeRegistry = RouteRegistry.getInstance();
        const route = routeRegistry.get(event.path, event.httpMethod as RouteMethod);

        if (route?.requestBodySchema) {
            route.requestBodySchema.parse(event.body);
        }

        const request: AppRouteRequest = {
            body: event.body,
            authenticatedUser: user
        };

        if (route?.params) {
            request.params = route.params;
        }

        const response = await route.handler(request);
        return response;
    } catch (err) {
        if (err instanceof AppError) {
            return {
                statusCode: err.statusCode,
                body: JSON.stringify({
                    message: err.message,
                    error: null
                })
            };
        } else if (err instanceof z.ZodError) {
            let error = err.issues.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
            }))
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Error parsing request body!",
                    error
                })
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "An error occured!",
                error: null
            })
        };
    }
}
