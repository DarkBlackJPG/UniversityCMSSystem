"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Employee = new Schema({
    user_id: { type: Number },
    address: { type: String },
    phonenumber: { type: String },
    website: { type: String },
    biography: { type: String },
    profilePicture: { type: String },
    title: { type: Number },
    office: { type: String },
    courses: { type: Array },
});
exports.default = mongoose_1.default.model('Employee', Employee, 'employees');
//# sourceMappingURL=Employee.model.js.map