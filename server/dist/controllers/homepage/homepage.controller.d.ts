import { Request, Response } from "express";
import { HomepageService } from "../../services/homepage/homepage.service";
export declare class HomepageController {
    private readonly homepageService;
    constructor(homepageService: HomepageService);
    getPublicStats: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=homepage.controller.d.ts.map