import { FilterQuery, UpdateQuery, PipelineStage } from "mongoose";

export interface IBaseRepository<T, TCreate = Partial<T>> {
  create(data: TCreate): Promise<T>;
  findByEmail(email: string): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  findAll(query?: FilterQuery<T>, page?: number, limit?: number): Promise<T[]>;
  count(query?: FilterQuery<T>): Promise<number>;
  update(id: string, data: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  verifyEmail(id: string): Promise<T | null>;
  aggregate<R = Record<string, unknown>>(
    pipeline: PipelineStage[],
  ): Promise<R[]>;
}
