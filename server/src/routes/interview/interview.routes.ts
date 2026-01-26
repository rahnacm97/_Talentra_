import { Router } from "express";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { USER_ROLES } from "../../shared/enums/enums";
import { CandidateInterviewController } from "../../controllers/interview/interviewCandidate.controller";
import { EmployerInterviewController } from "../../controllers/interview/interviewEmployer.controller";
import { InterviewService } from "../../services/interview/interview.service";
import { InterviewRepository } from "../../repositories/interview/interview.repository";
import { InterviewMapper } from "../../mappers/interview/interview.mapper";
<<<<<<< Updated upstream

const candidateRouter = Router();
const employerRouter = Router();

=======
import { NotificationAdapter } from "../../services/notification/NotificationAdapter";
import { InterviewRoundController } from "../../controllers/interview/interviewRound.controller";
import { InterviewRoundService } from "../../services/interview/interviewRound.service";
import { InterviewRoundRepository } from "../../repositories/interview/interviewRound.repository";
import { InterviewFeedbackController } from "../../controllers/interview/interviewFeedback.controller";
import { InterviewFeedbackService } from "../../services/interview/interviewFeedback.service";
import { InterviewFeedbackRepository } from "../../repositories/interview/interviewFeedback.repository";

const router = Router();

// Dependencies
const notificationAdapter = new NotificationAdapter();
>>>>>>> Stashed changes
const interviewRepo = new InterviewRepository();
const interviewMapper = new InterviewMapper();
const interviewService = new InterviewService(interviewRepo, interviewMapper);

<<<<<<< Updated upstream
=======
const roundRepo = new InterviewRoundRepository();
const roundService = new InterviewRoundService(
  roundRepo,
  interviewRepo,
  notificationAdapter,
);
const roundController = new InterviewRoundController(roundService);

const feedbackRepo = new InterviewFeedbackRepository();
const feedbackService = new InterviewFeedbackService(
  feedbackRepo,
  roundRepo,
  notificationAdapter,
);
const feedbackController = new InterviewFeedbackController(feedbackService);

//Interview routes
>>>>>>> Stashed changes
const candidateInterviewController = new CandidateInterviewController(
  interviewService,
);
const employerInterviewController = new EmployerInterviewController(
  interviewService,
);

<<<<<<< Updated upstream
candidateRouter.get(
  "/",
=======
router.get(
  "/candidate",
>>>>>>> Stashed changes
  verifyAuth([USER_ROLES.CANDIDATE]),
  candidateInterviewController.getMyInterviews.bind(
    candidateInterviewController,
  ),
);
router.get(
  "/employer",
  verifyAuth([USER_ROLES.EMPLOYER]),
  employerInterviewController.getInterviews.bind(employerInterviewController),
);
<<<<<<< Updated upstream

export {
  candidateRouter as candidateInterviewRouter,
  employerRouter as employerInterviewRouter,
};
=======
router.patch(
  "/employer/:id/status",
  verifyAuth([USER_ROLES.EMPLOYER]),
  employerInterviewController.updateInterviewStatus.bind(
    employerInterviewController,
  ),
);

router.post(
  "/rounds",
  verifyAuth([USER_ROLES.EMPLOYER]),
  roundController.createRound.bind(roundController),
);
router.get(
  "/rounds/employer",
  verifyAuth([USER_ROLES.EMPLOYER]),
  roundController.getEmployerRounds.bind(roundController),
);
router.get(
  "/rounds/candidate",
  verifyAuth([USER_ROLES.CANDIDATE]),
  roundController.getMyRounds.bind(roundController),
);
router.get(
  "/rounds/application/:applicationId",
  verifyAuth([USER_ROLES.EMPLOYER, USER_ROLES.CANDIDATE]),
  roundController.getRoundsForApplication.bind(roundController),
);
router.get(
  "/rounds/:id",
  verifyAuth([USER_ROLES.EMPLOYER, USER_ROLES.CANDIDATE]),
  roundController.getRoundById.bind(roundController),
);
router.patch(
  "/rounds/:id/status",
  verifyAuth([USER_ROLES.EMPLOYER]),
  roundController.updateRoundStatus.bind(roundController),
);
router.patch(
  "/rounds/:id/reschedule",
  verifyAuth([USER_ROLES.EMPLOYER]),
  roundController.rescheduleRound.bind(roundController),
);
router.patch(
  "/rounds/:id/cancel",
  verifyAuth([USER_ROLES.EMPLOYER]),
  roundController.cancelRound.bind(roundController),
);
router.get(
  "/rounds/:roundId/validate/:token",
  roundController.validateMeetingAccess.bind(roundController),
);
router.post(
  "/rounds/:roundId/feedback",
  verifyAuth([USER_ROLES.EMPLOYER]),
  feedbackController.submitFeedback.bind(feedbackController),
);
router.get(
  "/rounds/:roundId/feedback",
  verifyAuth([USER_ROLES.EMPLOYER]),
  feedbackController.getFeedbackForRound.bind(feedbackController),
);
router.get(
  "/rounds/:roundId/feedback/candidate",
  verifyAuth([USER_ROLES.EMPLOYER, USER_ROLES.CANDIDATE]),
  feedbackController.getSharedFeedbackForRound.bind(feedbackController),
);
router.get(
  "/rounds/feedback/application/:applicationId",
  verifyAuth([USER_ROLES.EMPLOYER]),
  feedbackController.getFeedbackForApplication.bind(feedbackController),
);
router.get(
  "/rounds/:roundId/feedback/summary",
  verifyAuth([USER_ROLES.EMPLOYER]),
  feedbackController.getFeedbackSummary.bind(feedbackController),
);
router.patch(
  "/feedback/:id/share",
  verifyAuth([USER_ROLES.EMPLOYER]),
  feedbackController.shareFeedbackWithCandidate.bind(feedbackController),
);

export { router as interviewRoutes };
>>>>>>> Stashed changes
