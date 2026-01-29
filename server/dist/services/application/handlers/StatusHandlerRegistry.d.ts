import { IStatusHandler, StatusHandlerContext } from "../../../interfaces/applications/IStatusHandler";
export declare class ReviewedHandler implements IStatusHandler {
    handle(context: StatusHandlerContext): Promise<void>;
}
export declare class ShortlistedHandler implements IStatusHandler {
    handle(context: StatusHandlerContext): Promise<void>;
}
export declare class InterviewHandler implements IStatusHandler {
    handle(context: StatusHandlerContext): Promise<void>;
}
export declare class HiredHandler implements IStatusHandler {
    handle(context: StatusHandlerContext): Promise<void>;
}
export declare class RejectedHandler implements IStatusHandler {
    handle(context: StatusHandlerContext): Promise<void>;
}
export declare class DefaultStatusHandler implements IStatusHandler {
    handle(context: StatusHandlerContext): Promise<void>;
}
export declare class StatusHandlerRegistry {
    private static handlers;
    static getHandler(status: string): IStatusHandler;
}
//# sourceMappingURL=StatusHandlerRegistry.d.ts.map