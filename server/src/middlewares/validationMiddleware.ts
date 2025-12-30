import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../shared/utils/ApiError";
import { HTTP_STATUS } from "../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../shared/enums/enums";

export interface ValidatedRequest<T> extends Request {
  body: T;
}
//Validation middleware
export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, _4: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body) as T;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message =
          err.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION_ERROR;
        return next(new ApiError(HTTP_STATUS.BAD_REQUEST, message));
      }
      next(err);
    }
  };

export const verifyCandidate = (
  req: Request<{ candidateId: string }>,
  _res: Response,
  next: NextFunction,
) => {
  const loggedInId = (req.user as { id: string }).id;

  if (req.params.candidateId !== loggedInId) {
    return next(
      new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.NOT_AUTHENTICATED),
    );
  }

  next();
};

export const verifyEmployer = (
  req: Request<{ id: string }>,
  _res: Response,
  next: NextFunction,
) => {
  const loggedInId = (req.user as { id: string }).id;

  if (req.params.id !== loggedInId) {
    return next(
      new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.NOT_AUTHENTICATED),
    );
  }

  next();
};
