import { ISubscription } from "../../interfaces/subscription/ISubscription";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { IInvoiceService } from "../../interfaces/subscription/ISubscriptionService";
export declare class InvoiceService implements IInvoiceService {
    generateInvoice(subscription: ISubscription, employer: IEmployer): PDFKit.PDFDocument;
    private _generateHeader;
    private _generateInvoiceInfo;
    private _generateCustomerInfo;
    private _generateInvoiceTable;
    private _generateFooter;
    private _calculateDuration;
}
//# sourceMappingURL=invoice.service.d.ts.map