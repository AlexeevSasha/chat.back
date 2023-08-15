import { CookieOptions, Response } from "express";

export class Cookie {
  set(res: Response, name: string, value: string, options: CookieOptions) {
    res.cookie(name, value, options);
  }

  delete(res: Response, name: string, options: CookieOptions) {
    res.cookie(name, "", {
      ...options,
      maxAge: 0,
    });
  }
}
