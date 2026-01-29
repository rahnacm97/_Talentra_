"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomepageController = void 0;
class HomepageController {
    constructor(homepageService) {
        this.homepageService = homepageService;
        this.getPublicStats = async (req, res) => {
            try {
                const stats = await this.homepageService.getPublicStats();
                res.status(200).json({
                    success: true,
                    data: stats,
                });
            }
            catch (error) {
                console.error("Error in getPublicStats controller:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch public statistics",
                });
            }
        };
    }
}
exports.HomepageController = HomepageController;
//# sourceMappingURL=homepage.controller.js.map