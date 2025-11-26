import { Router } from "express";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { USER_ROLES } from "../../shared/enums/enums";
import {
  CandidateInterviewController,
  EmployerInterviewController,
} from "../../controllers/interview/interview.controller";
import { InterviewService } from "../../services/interview/interview.service";
import { InterviewRepository } from "../../repositories/interview/interview.repository";
import { InterviewMapper } from "../../mappers/interview/interview.mapper";

const candidateRouter = Router();
const employerRouter = Router();

const interviewRepo = new InterviewRepository();
const interviewMapper = new InterviewMapper();
const interviewService = new InterviewService(interviewRepo, interviewMapper);

const candidateInterviewController = new CandidateInterviewController(
  interviewService,
);
const employerInterviewController = new EmployerInterviewController(
  interviewService,
);

candidateRouter.get(
  "/",
  verifyAuth([USER_ROLES.CANDIDATE]),
  candidateInterviewController.getMyInterviews.bind(
    candidateInterviewController,
  ),
);

employerRouter.get(
  "/",
  verifyAuth([USER_ROLES.EMPLOYER]),
  employerInterviewController.getInterviews.bind(employerInterviewController),
);

export {
  candidateRouter as candidateInterviewRouter,
  employerRouter as employerInterviewRouter,
};
