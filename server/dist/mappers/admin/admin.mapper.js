"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMapper = void 0;
class AdminMapper {
    toAdminResponseDTO(admin) {
        return {
            _id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: "Admin",
            emailVerified: admin.emailVerified ?? false,
        };
    }
    toAdminEntity(dto) {
        return {
            email: dto.email,
            password: dto.password,
        };
    }
}
exports.AdminMapper = AdminMapper;
//# sourceMappingURL=admin.mapper.js.map