import { Request, Response } from "express";
import { IAdminCandidateService } from "../../interfaces/users/admin/IAdminCandidateService";
import { BlockCandidateDTO } from "../../dto/admin/candidate.dto";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../shared/constants";
import { IAdminCandidateController } from "../../interfaces/users/admin/IAdminCandidateController";

export class AdminCandidateController implements IAdminCandidateController {
  constructor(private _candidateService: IAdminCandidateService) {}

  getAllCandidates = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;

      const result = await this._candidateService.getAllCandidates(
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

  getCandidateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.REQUIRED_ID });
        return;
      }
      const candidate = await this._candidateService.getCandidateById(id);
      if (!candidate) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: ERROR_MESSAGES.EMAIL_NOT_EXIST });
        return;
      }

      res.status(HTTP_STATUS.OK).json(candidate);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  blockUnblockCandidate = async (req: Request, res: Response) => {
    try {
      const data: BlockCandidateDTO = req.body;
      const candidate =
        await this._candidateService.blockUnblockCandidate(data);
      res
        .status(HTTP_STATUS.OK)
        .json({ candidate, message: SUCCESS_MESSAGES.STATUS_UPDATED });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message });
    }
  };
}
