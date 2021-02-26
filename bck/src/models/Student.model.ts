import mongoose from 'mongoose';
import Course from './Course.model';

const Schema = mongoose.Schema;

const Student = new Schema({
    user_id: {type: Number},
    index: {type: String},
    academic_level: {type: String},
    verify: {type: Boolean},
    semester: {type: Number},
    department : {type: Number},
});

export default mongoose.model('Student', Student, 'students');
