import { AxiosError } from "axios";

export type ApiError = AxiosError<{ message?: string }>;
