export interface ISubscriptionRepository {
  create(data: any): Promise<any>;
  findByEmployerId(employerId: string, options?: any): Promise<any[]>;
  updateStatus(id: string, status: string): Promise<any>;
  findById(id: string): Promise<any | null>;
}
