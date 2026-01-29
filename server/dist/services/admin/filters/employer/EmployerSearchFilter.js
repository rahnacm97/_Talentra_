"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerSearchFilter = void 0;
class EmployerSearchFilter {
    constructor(search) {
        this.search = search;
    }
    apply(query) {
        if (this.search) {
            query.$or = [
                { name: { $regex: this.search, $options: "i" } },
                { email: { $regex: this.search, $options: "i" } },
            ];
        }
    }
}
exports.EmployerSearchFilter = EmployerSearchFilter;
//# sourceMappingURL=EmployerSearchFilter.js.map