// import { BaseRepository } from "../base.repository";
// import {
//   IUserReader,
//   IUserWriter,
// } from "../../interfaces/auth/IAuthRepository";
// import { AuthSignupDTO } from "../../dto/auth/auth.dto";
// import { Model, Document } from "mongoose";

// export class AuthRepository<T extends Document>
//   extends BaseRepository<T, AuthSignupDTO>
//   implements IUserReader<T>, IUserWriter<T>
// {
//   constructor(model: Model<T>) {
//     super(model);
//   }

//   async findByEmail(email: string): Promise<T | null> {
//     return this.model.findOne({ email }).select("+password").exec();
//   }
// }
