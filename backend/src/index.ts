import "@/controllers/leadController"; // Load all controllers into RouteRegistry.
import RouteRegistry from "@/lib/routeRegistry";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const routeRegistry = RouteRegistry.getInstance();
    const handler = routeRegistry.getRouteHandler(event.path, event.httpMethod);

    if (handler) {
        const response = await handler(event);
        return response;
    }

    return {
        statusCode: 404,
        body: JSON.stringify({
            message: "Route not found!",
        })
    };
}
