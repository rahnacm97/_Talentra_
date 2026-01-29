import { Model, Document, FilterQuery, UpdateQuery, PipelineStage } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository";
export declare class BaseRepository<T extends Document, TCreate = Partial<T>> implements IBaseRepository<T, TCreate> {
    protected model: Model<T>;
    constructor(model: Model<T>);
    create(data: TCreate): Promise<T>;
    findById(id: string): Promise<T | null>;
    findByEmail(email: string): Promise<T | null>;
    findAll(query?: FilterQuery<T>, page?: number, limit?: number): Promise<T[]>;
    count(query?: FilterQuery<T>): Promise<number>;
    update(id: string, data: UpdateQuery<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    verifyEmail(id: string): Promise<T | null>;
    aggregate<R = Record<string, unknown>>(pipeline: PipelineStage[]): Promise<R[]>;
}
//# sourceMappingURL=base.repository.d.ts.map