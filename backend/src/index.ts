import "@/controllers/lead.controller"; // Load all controllers into RouteRegistry.
import RouteRegistry from "@/lib/route-registry";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as z from "zod"
import { LambdaCRMAppError } from "./lib/errors";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const rawBody = event.body;
    event.body = JSON.parse(rawBody || "{}");

    const routeRegistry = RouteRegistry.getInstance();
    const route = routeRegistry.getRoute(event.path, event.httpMethod);

    if (route) {
        if (event.body) {
            if (route?.requestBodySchema) {
                try {
                    route.requestBodySchema.parse(event.body);
                } catch (err) {
                    let errMessage = 'Error validating request body!'
                    let error = null;

                    if (err instanceof z.ZodError) {
                        error = err.issues.map(e => ({
                            field: e.path.join('.'),
                            message: e.message
                        }))
                    }

                    return {
                        statusCode: 400,
                        body: JSON.stringify({
                            message: errMessage,
                            error
                        })
                    };
                }
            } 
        }

        try {
            const response = await route.handler(event);
            return response;
        } catch (error) {
            if (error instanceof LambdaCRMAppError) {
                return {
                    statusCode: error.statusCode,
                    body: JSON.stringify({
                        message: error.message,
                        error: null
                    })
                };
            }
        }
    }

    return {
        statusCode: 404,
        body: JSON.stringify({
            message: "Route not found!",
        })
    };
}
