import { AuthSignupDTO } from "../../dto/auth/auth.dto";

export interface IUserReader<T> {
  findByEmail(email: string): Promise<T | null>;
  findById(id: string): Promise<T | null>;
}

export interface IUserWriter<T> {
  create(data: AuthSignupDTO): Promise<T>;
  updateBlockStatus?(id: string, block: boolean): Promise<T | null>;
  verifyEmail?(id: string): Promise<T | null>;
}