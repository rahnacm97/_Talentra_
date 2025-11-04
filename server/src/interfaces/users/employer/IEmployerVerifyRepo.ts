export interface IEmployerVerificationRepo {
  isVerified(employerId: string): Promise<boolean>;
}
