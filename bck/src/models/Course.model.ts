import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Course = new Schema({
    id: {type: Number},
    name: {type: String},
    coursename: {type: String},
    acronym: {type: String},
    semester: {type: Number},
    type: {type: Number},
    department: {type: Number},
});

export default mongoose.model('Course', Course, 'courses');
