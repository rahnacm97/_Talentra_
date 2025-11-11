import { Schema, model } from "mongoose";
import { IAdmin } from "../interfaces/users/admin/IAdmin";

const adminSchema = new Schema<IAdmin>({
  //_id: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  emailVerified: { type: Boolean, default: true },
  blocked: { type: Boolean, default: false },
});

export default model<IAdmin>("Admin", adminSchema);
