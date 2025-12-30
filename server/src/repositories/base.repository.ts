import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  PipelineStage,
} from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository";

export class BaseRepository<T extends Document, TCreate = Partial<T>>
  implements IBaseRepository<T, TCreate>
{
  constructor(protected model: Model<T>) {}

  async create(data: TCreate): Promise<T> {
    return new this.model(data).save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findByEmail(email: string): Promise<T | null> {
    return this.model.findOne({ email }).exec();
  }

  async findAll(
    query: FilterQuery<T> = {},
    page = 1,
    limit = 10,
  ): Promise<T[]> {
    return this.model
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async count(query: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(query).exec();
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  async verifyEmail(id: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        {
          emailVerified: true,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async aggregate<R = Record<string, unknown>>(
    pipeline: PipelineStage[],
  ): Promise<R[]> {
    return this.model.aggregate(pipeline).exec();
  }
}
