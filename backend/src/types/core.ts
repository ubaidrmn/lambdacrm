import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export interface RouteDecoratorOptions {
    path: string;
    method: RouteMethod;
};

export const enum RouteMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
  PATCH = 'PATCH'
};

export type RouteHandler = (event: APIGatewayProxyEvent) => APIGatewayProxyResult;
