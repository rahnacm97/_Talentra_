export interface AdminLoginRequest{
    email: string;
    password: string;
}

// export interface AdminAuthResponse {
//     token: string;
//     admin: {
//         id: string;
//         name: string;
//         email: string;
//     }
// }

export interface AdminAuthResponse {
  accessToken: string;
  refreshToken: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
}


export interface AdminLoginErrors{
    email?: string;
    password?: string;
}
