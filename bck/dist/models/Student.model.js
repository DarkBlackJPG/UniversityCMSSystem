"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Student = new Schema({
    user_id: { type: Number },
    index: { type: String },
    academic_level: { type: String },
    verify: { type: Boolean },
    department: { type: Number },
});
exports.default = mongoose_1.default.model('Student', Student, 'students');
//# sourceMappingURL=Student.model.js.map