export class ApiError extends Error {
  public readonly status: number;
  public readonly errors: any[];

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;

    // Fix the prototype chain explicitly required for custom classes in TS/JS
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture the clean stack trace, removing this constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }

  // 400 Bad Request
  static badRequest(message: string = "Bad Request", errors: any[] = []) {
    return new ApiError(400, message, errors);
  }

  // 401 Unauthorized
  static unauthorized(message: string = "Unauthorized") {
    return new ApiError(401, message);
  }

  // 403 Forbidden
  static forbidden(message: string = "Forbidden") {
    return new ApiError(403, message);
  }

  // 404 Not Found
  static notFound(message: string = "Resource Not Found") {
    return new ApiError(404, message);
  }

  // 500 Internal Server Error
  static internal(message: string = "Internal Server Error") {
    return new ApiError(500, message);
  }
}
