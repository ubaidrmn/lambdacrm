import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as z from "zod";

export interface RouteDecoratorOptions {
  path: string;
  method: RouteMethod;
  requestBodySchema?: z.ZodObject
};

export const enum RouteMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
  PATCH = 'PATCH'
};

export type RouteHandler = (event: APIGatewayProxyEvent) => APIGatewayProxyResult;
