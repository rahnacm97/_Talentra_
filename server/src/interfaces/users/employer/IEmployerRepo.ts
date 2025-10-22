export interface IEmployerRepo<T> {
  updateBlockStatus?(id: string, block: boolean): Promise<T | null>;
  findByCompanyName(name: string): Promise<T | null>;
}
