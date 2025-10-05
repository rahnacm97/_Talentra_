import Admin from "../../models/Admin.model";
import { IAdmin } from "../../interfaces/users/admin/IAdmin";
import { IUserReader, IUserWriter } from "../../interfaces/auth/IAuthRepository";
import { AuthSignupDTO } from "../../dto/auth/auth.dto";

export class AdminRepository implements IUserReader<IAdmin>, IUserWriter<IAdmin> {
  async create(data: AuthSignupDTO): Promise<IAdmin> {
    return new Admin(data).save();
  }

  async findById(id: string): Promise<IAdmin | null> {
    return Admin.findById(id).exec(); 
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email });
  }
}
