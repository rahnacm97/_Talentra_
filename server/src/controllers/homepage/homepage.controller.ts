import { Request, Response } from "express";
import { HomepageService } from "../../services/homepage/homepage.service";

export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  getPublicStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.homepageService.getPublicStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in getPublicStats controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch public statistics",
      });
    }
  };
}
