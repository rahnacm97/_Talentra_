import { Request, Response } from "express";
import { IAdminEmployerService } from "../../interfaces/users/admin/IAdminEmployerService";
import { BlockEmployerDTO } from "../../dto/admin/employer.dto";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../shared/constants";
import { IAdminEmployerController } from "../../interfaces/users/admin/IAdminEmployerController";

export class AdminEmployerController implements IAdminEmployerController {
  constructor(private _employerService: IAdminEmployerService) {}

  getAllEmployers = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;

      const result = await this._employerService.getAllEmployers(
        page,
        limit,
        search,
      );
      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.FETCH_SUCCESS, data: result });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  getEmployerById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.REQUIRED_ID });
        return;
      }

      const employer = await this._employerService.getEmployerById(id);
      if (!employer) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: ERROR_MESSAGES.EMAIL_NOT_EXIST });
        return;
      }

      res.status(HTTP_STATUS.OK).json(employer);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  blockUnblockEmployer = async (req: Request, res: Response) => {
    try {
      const data: BlockEmployerDTO = req.body;
      const employer = await this._employerService.blockUnblockEmployer(data);
      res
        .status(HTTP_STATUS.OK)
        .json({ employer, message: SUCCESS_MESSAGES.STATUS_UPDATED });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message });
    }
  };
}
