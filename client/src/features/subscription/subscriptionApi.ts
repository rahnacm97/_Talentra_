import api from "../../api/api";
import { API_ROUTES } from "../../shared/constants/constants";
import type {
  CreateOrderResponseDTO,
  VerifyPaymentResponseDTO,
  SubscriptionHistoryResponseDTO,
  PaymentDetailsDTO,
  PlanDetailsDTO,
} from "../../types/subscription/subscription.types";

//Payment creating
export const createSubscriptionOrder = async (
  amount: number,
  currency: string,
): Promise<CreateOrderResponseDTO> => {
  const response = await api.post<CreateOrderResponseDTO>(
    API_ROUTES.SUBSCRIPTION.CREATE_ORDER,
    {
      amount,
      currency,
    },
  );
  return response.data;
};

//Payment verification
export const verifySubscriptionPayment = async (
  paymentDetails: PaymentDetailsDTO,
  planDetails: PlanDetailsDTO,
): Promise<VerifyPaymentResponseDTO> => {
  const response = await api.post<VerifyPaymentResponseDTO>(
    API_ROUTES.SUBSCRIPTION.VERIFY_PAYMENT,
    {
      paymentDetails,
      planDetails,
    },
  );
  return response.data;
};

//Fetch subscription history
export const getSubscriptionHistory =
  async (): Promise<SubscriptionHistoryResponseDTO> => {
    const response = await api.get<SubscriptionHistoryResponseDTO>(
      API_ROUTES.SUBSCRIPTION.HISTORY,
    );
    return response.data;
  };

//Invoice downloading
export const downloadInvoice = async (
  subscriptionId: string,
): Promise<Blob> => {
  const response = await api.get(
    `${API_ROUTES.SUBSCRIPTION.HISTORY.replace("/history", "")}/invoice/${subscriptionId}`,
    {
      responseType: "blob",
    },
  );
  return response.data;
};
