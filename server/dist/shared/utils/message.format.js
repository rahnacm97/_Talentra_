"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMessage = void 0;
const formatMessage = (template, data) => {
    return Object.entries(data).reduce((msg, [key, value]) => {
        return msg.replace(new RegExp(`{{${key}}}`, "g"), value);
    }, template);
};
exports.formatMessage = formatMessage;
//# sourceMappingURL=message.format.js.map