import { APIGatewayProxyResult } from "aws-lambda";
import LeadController from "@/controllers/leadController";
import RouteRegistry from "@/lib/routeRegistry";

export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
    const routeRegistry = RouteRegistry.getInstance();

    switch (event.path) {
        case '/leads':
            new LeadController();
    }

    const key = routeRegistry.constructKey(event.path, event.httpMethod);
    const handler = routeRegistry.getRoute(key);

    if (handler) {
        const response = await handler.call(event);
        return response;
    }

    return {
        statusCode: 404,
        body: JSON.stringify({
            message: "Route not found!",
        })
    };
}
