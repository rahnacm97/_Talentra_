import { IEmployerService } from "../../interfaces/users/employer/IEmployerService";
import { INotificationService } from "../../interfaces/shared/INotificationService";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { IEmployerMapper } from "../../interfaces/users/employer/IEmployerMapper";
import { EmployerDataDTO, EmployerAnalyticsDTO } from "../../dto/employer/employer.dto";
import { IEmployerAnalyticsRepository } from "../../interfaces/users/employer/IEmployerRepo";
import { IEmployerAnalyticsMapper } from "../../interfaces/users/employer/IEmployerMapper";
import { IEmployerAnalyticsService } from "../../interfaces/users/employer/IEmployerService";
import { ISubscriptionService } from "../../interfaces/subscription/ISubscriptionService";
import { ISubscriptionRepository } from "../../interfaces/subscription/ISubscriptionRepo";
import { IEmployerRepository } from "../../interfaces/users/employer/IEmployerRepository";
import { ISubscriptionMapper } from "../../interfaces/subscription/ISubscriptionMapper";
import { CreateOrderRequestDTO, CreateOrderResponseDTO, VerifyPaymentRequestDTO, VerifyPaymentResponseDTO, SubscriptionHistoryResponseDTO } from "../../dto/subscription/subscription.dto";
export declare class EmployerService implements IEmployerService {
    private _repository;
    private _employerMapper;
    private _notificationService;
    constructor(_repository: IEmployerRepository, _employerMapper: IEmployerMapper, _notificationService: INotificationService);
    getEmployerById(employerId: string): Promise<IEmployer | null>;
    uploadFile(file: Express.Multer.File): Promise<string>;
    updateProfile(employerId: string, data: EmployerDataDTO, businessLicenseFile?: Express.Multer.File, profileImageFile?: Express.Multer.File): Promise<EmployerDataDTO>;
}
export declare class EmployerAnalyticsService implements IEmployerAnalyticsService {
    private _repository;
    private _mapper;
    constructor(_repository: IEmployerAnalyticsRepository, _mapper: IEmployerAnalyticsMapper);
    getEmployerAnalytics(employerId: string, timeRange: string): Promise<EmployerAnalyticsDTO>;
}
export declare class SubscriptionService implements ISubscriptionService {
    private _subscriptionRepository;
    private _employerRepository;
    private _subscriptionMapper;
    private _razorpay;
    constructor(_subscriptionRepository: ISubscriptionRepository, _employerRepository: IEmployerRepository, _subscriptionMapper: ISubscriptionMapper);
    createOrder(request: CreateOrderRequestDTO): Promise<CreateOrderResponseDTO>;
    verifyPayment(employerId: string, request: VerifyPaymentRequestDTO): Promise<VerifyPaymentResponseDTO>;
    getSubscriptionHistory(employerId: string): Promise<SubscriptionHistoryResponseDTO>;
}
//# sourceMappingURL=employer.service.d.ts.map