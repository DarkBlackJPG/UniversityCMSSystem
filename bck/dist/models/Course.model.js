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
    coursecode: { type: String },
    acronym: { type: String },
    semester: { type: Number },
    type: { type: Number },
    department: { type: Number },
    courseDetails: { type: Array },
    isMapped: { type: Boolean },
    mapHash: { type: Number },
    isMaster: { type: Boolean },
    engagement: { type: Array },
    notifications: { type: Array },
    exams: { type: Array, default: [] },
    excercises: { type: Array, default: [] },
    labs_docs: { type: Array, default: [] },
    labs_texts: { type: Array, default: [] },
    lectures: { type: Array, default: [] },
    projects_docs: { type: Array, default: [] },
    projects_texts: { type: Array, default: [] },
    exams_visible: { type: Boolean, default: true },
    project_visible: { type: Boolean, default: true },
    lab_visible: { type: Boolean, default: true },
});
exports.default = mongoose_1.default.model('Course', Course, 'courses');
//# sourceMappingURL=Course.model.js.map