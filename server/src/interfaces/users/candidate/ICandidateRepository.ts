export interface ICandidateRepo<T> {
  updateBlockStatus?(id: string, block: boolean): Promise<T | null>;
}
