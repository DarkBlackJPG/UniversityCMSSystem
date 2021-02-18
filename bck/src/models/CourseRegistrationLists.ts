{

}
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

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

export default mongoose.model('CourseRegistrationList', CourseRegistrationList, 'course_registration_lists');
