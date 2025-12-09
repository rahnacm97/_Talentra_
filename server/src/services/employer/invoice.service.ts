import PDFDocument from "pdfkit";
import { ISubscription } from "../../interfaces/subscription/ISubscription";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { IInvoiceService } from "../../interfaces/subscription/ISubscriptionService";

export class InvoiceService implements IInvoiceService {
  //Creating invoice
  generateInvoice(
    subscription: ISubscription,
    employer: IEmployer,
  ): PDFKit.PDFDocument {
    const doc = new PDFDocument({ margin: 50 });

    this._generateHeader(doc);

    this._generateInvoiceInfo(doc, subscription);

    this._generateCustomerInfo(doc, employer);

    this._generateInvoiceTable(doc, subscription);

    this._generateFooter(doc, subscription);

    return doc;
  }

  private _generateHeader(doc: PDFKit.PDFDocument) {
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("TALENTRA", 50, 40)
      .fontSize(9)
      .font("Helvetica")
      .text("Talent Acquisition Platform", 50, 62)
      .text("Email: support@talentra.com", 50, 75)
      .text("Phone: +91 1800-123-4567", 50, 88);
  }

  private _generateInvoiceInfo(
    doc: PDFKit.PDFDocument,
    subscription: ISubscription,
  ) {
    const invoiceNumber = `INV-${String(subscription._id).slice(-8).toUpperCase()}`;
    const invoiceDate = new Date(subscription.createdAt).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("INVOICE", 50, 120)
      .fontSize(9)
      .font("Helvetica")
      .text(`Invoice Number: ${invoiceNumber}`, 50, 145)
      .text(`Invoice Date: ${invoiceDate}`, 50, 158)
      .text(
        `Payment Method: ${subscription.transactionId ? "Razorpay" : "N/A"}`,
        50,
        171,
      );

    if (subscription.transactionId) {
      doc.text(`Transaction ID: ${subscription.transactionId}`, 50, 184);
    }
  }

  private _generateCustomerInfo(doc: PDFKit.PDFDocument, employer: IEmployer) {
    let yPos = 145;
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("BILL TO:", 320, yPos)
      .font("Helvetica")
      .text(employer.name, 320, yPos + 13)
      .text(employer.email, 320, yPos + 26);

    if (employer.phoneNumber) {
      doc.text(employer.phoneNumber, 320, yPos + 39);
    }

    if (employer.location) {
      doc.text(employer.location, 320, yPos + 52);
    }
  }

  private _generateInvoiceTable(
    doc: PDFKit.PDFDocument,
    subscription: ISubscription,
  ) {
    const tableTop = 220;
    const itemCodeX = 50;
    const descriptionX = 130;
    const quantityX = 340;
    const priceX = 410;
    const amountX = 490;

    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("ITEM", itemCodeX, tableTop)
      .text("DESCRIPTION", descriptionX, tableTop)
      .text("QTY", quantityX, tableTop)
      .text("PRICE", priceX, tableTop)
      .text("AMOUNT", amountX, tableTop);

    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, tableTop + 13)
      .lineTo(550, tableTop + 13)
      .stroke();

    const position = tableTop + 25;
    const planName =
      subscription.plan === "professional"
        ? "Professional Plan"
        : subscription.plan === "enterprise"
          ? "Enterprise Plan"
          : "Free Plan";

    const duration = this._calculateDuration(
      subscription.startDate,
      subscription.endDate,
    );

    doc
      .fontSize(9)
      .font("Helvetica")
      .text("1", itemCodeX, position)
      .text(`${planName} - ${duration}`, descriptionX, position)
      .text("1", quantityX, position)
      .text(`₹${subscription.price.toLocaleString()}`, priceX, position)
      .text(`₹${subscription.price.toLocaleString()}`, amountX, position);

    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, position + 18)
      .lineTo(550, position + 18)
      .stroke();

    const subtotalPosition = position + 35;

    const subtotal = subscription.subtotal || subscription.price;
    const gstRate = subscription.gstRate || 0.18;
    const gstAmount = subscription.gstAmount || subtotal * gstRate;
    const totalAmount = subscription.totalAmount || subtotal + gstAmount;

    doc
      .fontSize(9)
      .font("Helvetica")
      .text("Subtotal:", 400, subtotalPosition)
      .text(`₹${subtotal.toLocaleString()}`, amountX, subtotalPosition)
      .text(`GST (${(gstRate * 100).toFixed(0)}%):`, 400, subtotalPosition + 18)
      .text(`₹${gstAmount.toFixed(2)}`, amountX, subtotalPosition + 18);

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Total:", 400, subtotalPosition + 40)
      .text(`₹${totalAmount.toFixed(2)}`, amountX, subtotalPosition + 40);
  }

  private _generateFooter(
    doc: PDFKit.PDFDocument,
    subscription: ISubscription,
  ) {
    const footerTop = 380;

    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("Subscription Period:", 50, footerTop)
      .font("Helvetica")
      .text(
        `${new Date(subscription.startDate).toLocaleDateString()} - ${new Date(subscription.endDate).toLocaleDateString()}`,
        50,
        footerTop + 13,
      );

    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("Payment Status:", 50, footerTop + 35)
      .font("Helvetica")
      .fillColor(subscription.status === "active" ? "#22c55e" : "#6b7280")
      .text(
        subscription.status === "active" ? "PAID" : "PENDING",
        50,
        footerTop + 48,
      )
      .fillColor("#000000");

    doc
      .fontSize(9)
      .font("Helvetica")
      .text("Thank you for your business!", 50, footerTop + 75, {
        align: "center",
        width: 500,
      })
      .fontSize(8)
      .text(
        "This is a computer-generated invoice and does not require a signature.",
        50,
        footerTop + 92,
        { align: "center", width: 500 },
      );
  }

  private _calculateDuration(startDate: Date, endDate: Date): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );

    if (months === 1) return "Monthly";
    if (months === 12) return "Annual";
    return `${months} Months`;
  }
}
