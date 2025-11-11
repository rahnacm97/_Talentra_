import Admin from "../../models/Admin.model";
import { Types, Document } from "mongoose";
import { IAdmin } from "../../interfaces/users/admin/IAdmin";
import {
  IUserReader,
  IUserWriter,
} from "../../interfaces/auth/IAuthRepository";
import { AuthSignupDTO } from "../../dto/auth/auth.dto";
import { BaseRepository } from "../base.repository";

export class AdminRepository
  extends BaseRepository<IAdmin & Document, AuthSignupDTO>
  implements IUserReader<IAdmin>, IUserWriter<IAdmin>
{
  constructor() {
    super(Admin);
  }

  async findById(id: string): Promise<IAdmin | null> {
    try {
      const admin = await this.model.findById(new Types.ObjectId(id)).exec();
      return admin;
    } catch {
      return null;
    }
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return this.model.findOne({ email }).exec();
  }
}
