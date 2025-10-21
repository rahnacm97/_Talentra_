import { AuthSignupDTO } from "../../dto/auth/auth.dto";
import { User } from "../../types/types";
import { Document } from "mongoose";

export interface IUserReader<T = User> {
  findByEmail(email: string): Promise<T | null>;
  findById(id: string): Promise<T | null>;
}

export interface IUserWriter<T = User> {
  create(data: AuthSignupDTO): Promise<T>;
  updateBlockStatus?(id: string, block: boolean): Promise<T | null>;
  verifyEmail?(id: string): Promise<T | null>;
}

export interface IUserRepository<T extends Document>
  extends IUserReader<T>,
    IUserWriter<T> {}
