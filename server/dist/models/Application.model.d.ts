import mongoose, { Document } from "mongoose";
import { IApplication } from "../interfaces/applications/IApplication";
export interface IApplicationDocument extends Omit<IApplication, "id">, Document {
    _id: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<IApplicationDocument, {}, {}, {}, mongoose.Document<unknown, {}, IApplicationDocument, {}, {}> & IApplicationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Application.model.d.ts.map