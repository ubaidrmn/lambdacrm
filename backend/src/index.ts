import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import LeadController from "@/controllers/leadController";
import RouteRegistry from "@/lib/routeRegistry";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const routeRegistry = RouteRegistry.getInstance();

    switch (event.path) {
        case '/leads':
            new LeadController();
    }

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
