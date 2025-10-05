import { Router } from "express";
import { CandidateController } from "../../controllers/candidate/candidate.controller";

const router = Router();
const candidateController = new CandidateController();



export default router;
