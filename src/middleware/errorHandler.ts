import { Request, Response, NextFunction } from "express";
import { logError } from "../logging/logger";

export function genericErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logError("Unhandled server error", err);
  res.status(500).send("Oops! Something went wrong!");
}
