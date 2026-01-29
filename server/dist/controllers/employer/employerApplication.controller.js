"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerApplicationsController = void 0;
class EmployerApplicationsController {
    constructor(_service) {
        this._service = _service;
    }
    //Get applications
    async getApplications(req, res, next) {
        try {
            const employerId = req.user.id;
            const { page = 1, limit = 10, search, status, jobTitle } = req.query;
            const query = {
                page: Number(page),
                limit: Number(limit),
                search: search,
                jobTitle: jobTitle,
                status: status,
            };
            const result = await this._service.getApplicationsForEmployer(employerId, query);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    }
    //Update application status
    async updateApplicationStatus(req, res, next) {
        try {
            const { applicationId } = req.params;
            const employerId = req.user.id;
            const { status, interviewDate, interviewLink, rejectionReason, rejectionFeedback, } = req.body;
            const payload = { status };
            if (typeof interviewDate === "string" && interviewDate.trim() !== "") {
                payload.interviewDate = interviewDate.trim();
            }
            if (typeof interviewLink === "string" && interviewLink.trim() !== "") {
                payload.interviewLink = interviewLink.trim();
            }
            if (rejectionReason)
                payload.rejectionReason = rejectionReason;
            if (rejectionFeedback)
                payload.rejectionFeedback = rejectionFeedback;
            const result = await this._service.updateApplicationStatus(employerId, applicationId, payload);
            res.json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.EmployerApplicationsController = EmployerApplicationsController;
//# sourceMappingURL=employerApplication.controller.js.map