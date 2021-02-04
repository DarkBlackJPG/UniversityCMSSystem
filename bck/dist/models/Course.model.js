"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Course = new Schema({
    id: { type: Number },
    name: { type: String },
    coursename: { type: String },
    acronym: { type: String },
    semester: { type: Number },
    type: { type: Number },
    department: { type: Number },
});
exports.default = mongoose_1.default.model('Course', Course, 'courses');
//# sourceMappingURL=Course.model.js.map