import { Model, Document } from "mongoose";
import { IUserReader, IUserWriter } from "../../interfaces/auth/IAuthRepository";
import { AuthSignupDTO } from "../../dto/auth/auth.dto";

export class AuthRepository<T extends Document> implements IUserReader<T>, IUserWriter<T> {
  constructor(private model: Model<T>) {}

  async create(data: AuthSignupDTO): Promise<T> {
    return new this.model(data).save();
  }

  async findByEmail(email: string): Promise<T | null> {
    return this.model.findOne({ email }).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findAll(query: any, page: number, limit: number): Promise<T[]> {
    return this.model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async count(query: any): Promise<number> {
    return this.model.countDocuments(query).exec();
  }

  async updateBlockStatus(id: string, block: boolean): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, { blocked: block }, { new: true }).exec();
  }

  async verifyEmail(id: string): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, { emailVerified: true }, { new: true }).exec();
  }
}
