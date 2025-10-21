import { Request, Response } from "express";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../shared/constants";
import { ICandidateController } from "../../interfaces/users/candidate/ICandidateController";
import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";

export class CandidateController implements ICandidateController {
  constructor(private _candidateService: ICandidateService) {}
  async getProfile(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const candidateId = req.params.id;
      if (!candidateId) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.VALIDATION_ERROR });
        return;
      }
      const candidate =
        await this._candidateService.getCandidateById(candidateId);
      if (!candidate) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: ERROR_MESSAGES.EMAIL_NOT_EXIST });
        return;
      }

      if (candidate.blocked) {
        res
          .status(HTTP_STATUS.FORBIDDEN)
          .json({ message: ERROR_MESSAGES.USER_BLOCKED });
        return;
      }
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.CANDIDATE_FETCHED,
        data: candidate,
      });

      return;
    } catch (err: unknown) {
      console.error(err);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR });
      return;
    }
  }
}
