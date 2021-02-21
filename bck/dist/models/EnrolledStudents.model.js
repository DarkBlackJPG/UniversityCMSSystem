"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const EnrolledStudents = new Schema({
    student_id: { type: Number },
    course_id: { type: String },
});
exports.default = mongoose_1.default.model('EnrolledStudents', EnrolledStudents, 'enrolled_students');
//# sourceMappingURL=EnrolledStudents.model.js.map