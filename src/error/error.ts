export class BadRequestError extends Error {
  status: 400;

  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}

export class UnauthenticatedError extends Error {
  status: 401;

  constructor(message: string) {
    super(message);
    this.status = 401;
  }
}

export class NotFoundError extends Error {
  status: 404;

  constructor(message: string) {
    super(message);
    this.status = 404;
  }
}
