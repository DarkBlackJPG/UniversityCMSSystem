import mongoose from 'mongoose';
import Course from './Course.model';

const Schema = mongoose.Schema;

const EnrolledStudents = new Schema({
    student_id: {type: Number},
    course_id: {type: String},
});

export default mongoose.model('EnrolledStudents', EnrolledStudents, 'enrolled_students');
