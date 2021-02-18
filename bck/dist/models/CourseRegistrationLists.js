"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
{
}
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const CourseRegistrationList = new Schema({
    id: {
        type: Number,
    },
    title: {
        type: String,
    },
    exam_date: {
        type: Date,
    },
    location: {
        type: String,
    },
    course_id: {
        type: Number,
    },
    date_open: {
        type: Date,
    },
    date_close: {
        type: Date,
    },
    isActive: {
        type: Boolean,
    },
    enrolled: {
        type: Array,
    },
    max_num_students: {
        type: Number,
    },
    enrolled_number: {
        type: Number,
    },
    uploadEnabled: {
        type: Boolean,
    },
    student_files: {
        type: Array,
    },
    groups: {
        type: Array,
    },
});
exports.default = mongoose_1.default.model('CourseRegistrationList', CourseRegistrationList, 'course_registration_lists');
//# sourceMappingURL=CourseRegistrationLists.js.map