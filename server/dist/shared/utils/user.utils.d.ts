import { IUserReader, IUserWriter } from "../../interfaces/auth/IAuthRepository";
import { AnyUser, UserType } from "../../type/types";
import { GoogleAuthUserRepoMap, GoogleAuthUser } from "../../type/types";
export declare function detectUserByEmail(email: string, repos: Record<UserType, IUserReader<AnyUser> & IUserWriter<AnyUser>>): Promise<{
    user: AnyUser;
    userType: UserType;
} | null>;
export declare function detectUserByEmailForGoogle(email: string, repos: GoogleAuthUserRepoMap): Promise<{
    user: GoogleAuthUser;
    userType: "Candidate" | "Employer";
} | null>;
//# sourceMappingURL=user.utils.d.ts.map