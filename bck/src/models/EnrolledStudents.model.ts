import mongoose from 'mongoose';
import Course from './Course.model';

const Schema = mongoose.Schema;

const EnrolledStudents = new Schema({
    user_id: {type: Number},
    course_id: {type: String},
    student_array: {type: Array},
});

export default mongoose.model('EnrolledStudents', EnrolledStudents, 'enrolled_students');
