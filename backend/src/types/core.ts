import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as z from "zod";
import { User } from "@/types/user.model";

export interface RegisterRouteOptions {
  pattern: string | RegExp;
  method: RouteMethod;
  requestBodySchema?: z.ZodObject
};

export interface ControllerDecoratorOptions {
  path: string;
}

export const enum RouteMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
  PATCH = 'PATCH'
};

export type RouteHandler = (request: AppRouteRequest) => APIGatewayProxyResult;

export interface AppRoute extends RegisterRouteOptions { 
  handler: RouteHandler; 
  params?: Record<string, string>
}

export interface AppRouteRequest {
  body: string | null,
  params?: Record<string, string>
  authenticatedUser: User
}
