import { FilterQuery } from "mongoose";

export interface IQueryFilter<T> {
  apply(query: FilterQuery<T>): void;
}
