import mongoose, { Document } from "mongoose";
import { IInterview } from "../interfaces/interviews/IInterview";
export interface IInterviewDocument extends Omit<IInterview, "id">, Document {
    _id: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<IInterviewDocument, {}, {}, {}, mongoose.Document<unknown, {}, IInterviewDocument, {}, {}> & IInterviewDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Interview.model.d.ts.map