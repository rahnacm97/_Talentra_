export interface Employer {
  id: string;
  name: string;
  email: string;
  resume?: string;
  blocked: boolean;
}


export interface EmployerResponseDTO {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  blocked: boolean;
  joinDate?: string;
  jobsPosted?: number;
}

export interface BlockEmployerDTO {
  employerId: string;
  block: boolean;
}

export interface EmployersState {
  employers: EmployerResponseDTO[];
  total: number;
  loading: boolean;
  error: string | null;
}
