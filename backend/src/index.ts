import "@/controllers/lead.controller";
import "@/controllers/user.controller";
import "@/controllers/organization.controller";
import "@/controllers/contact.controller";

import * as z from "zod"
import RouteRegistry from "@/lib/route.registry";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AppError } from "@/lib/errors";
import { AppRouteRequest, RouteMethod } from "./types/core";
import { getAuthenticatedUser } from "./lib/auth";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const accessToken = (event.headers["authorization"] || event.headers["Authorization"])?.split("Bearer ")[1];
        if (!accessToken) { throw new AppError("Authorization token not found!"); }

        const user = await getAuthenticatedUser(accessToken);

        const routeRegistry = RouteRegistry.getInstance();
        const route = routeRegistry.get(event.path, event.httpMethod as RouteMethod);

        if (["PUT", "PATCH", "POST"].includes(route.method)) {
            const rawBody = event.body;
            event.body = JSON.parse(rawBody || "{}");

            if (route?.requestBodySchema) {
                route.requestBodySchema.parse(event.body);
            }
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
        console.log(err);

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
            })
        };
    }
}
