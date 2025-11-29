import { AuthSignupDTO } from "../../dto/auth/auth.dto";
import { IUserEntity } from "../../type/types";
import { Document } from "mongoose";

export interface IUserReader<T = IUserEntity> {
  findByEmail(email: string): Promise<T | null>;
  findById(id: string): Promise<T | null>;
}

export interface IUserWriter<T = IUserEntity> {
  create(data: AuthSignupDTO): Promise<T>;
  updateBlockStatus?(id: string, block: boolean): Promise<T | null>;
  verifyEmail?(id: string): Promise<T | null>;
}

export interface IUserRepository<T extends Document>
  extends IUserReader<T>,
    IUserWriter<T> {}
