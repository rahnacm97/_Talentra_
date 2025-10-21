export interface INotificationService {
  sendOtp(email: string, otp: string): Promise<void>;
}
