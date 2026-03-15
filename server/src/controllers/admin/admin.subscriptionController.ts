import { Request, Response, NextFunction } from "express";
import { ISubscriptionService } from "../../interfaces/subscription/ISubscriptionService";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";

export class AdminSubscriptionController {
  constructor(private _subscriptionService: ISubscriptionService) {}

  getAllSubscriptions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page, limit, sortBy, sortOrder, search, status } = req.query;
      const options = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        sort: (sortBy
          ? { [sortBy as string]: sortOrder === "desc" ? -1 : 1 }
          : { createdAt: -1 }) as Record<string, 1 | -1>,
        search: search as string,
        status: status as string,
      };

      const result =
        await this._subscriptionService.getAllSubscriptions(options);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Subscriptions fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
