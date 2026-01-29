"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const enums_1 = require("../../shared/enums/enums");
class AdminAuthService {
    constructor(_adminRepository, _tokenService, _adminMapper) {
        this._adminRepository = _adminRepository;
        this._tokenService = _tokenService;
        this._adminMapper = _adminMapper;
    }
    //Admin login
    async login(data) {
        if (!data.email || !data.password) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        const adminEntity = this._adminMapper.toAdminEntity(data);
        const admin = await this._adminRepository.findByEmail(adminEntity.email);
        if (!admin)
            throw new Error("Admin not found");
        const isMatch = await bcryptjs_1.default.compare(data.password, admin.password);
        if (!isMatch)
            throw new Error("Invalid credentials");
        const userData = this._adminMapper.toAdminResponseDTO(admin);
        const accessToken = this._tokenService.generateAccessToken({
            id: userData._id,
            email: userData.email,
            role: userData.role,
        });
        const refreshToken = this._tokenService.generateRefreshToken({
            id: userData._id,
            email: userData.email,
            role: userData.role,
        });
        return {
            user: userData,
            accessToken,
            refreshToken,
        };
    }
    //Admin logout
    async logout(refreshToken) {
        this._tokenService.invalidateToken(refreshToken);
        return { message: "Admin logged out successfully" };
    }
}
exports.AdminAuthService = AdminAuthService;
//# sourceMappingURL=admin.authService.js.map