"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasEmailVerification = hasEmailVerification;
function hasEmailVerification(user) {
    return user && "emailVerified" in user;
}
//# sourceMappingURL=types.js.map