export type RouteDecoratorOptions = {
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
