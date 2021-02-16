import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Course = new Schema({
    id: {type: Number},
    name: {type: String},
    coursecode: {type: String},
    acronym: {type: String},
    semester: {type: Number},
    type: {type: Number},
    department: {type: Number},
    courseDetails: {type: Array},
    isMapped: {type: Boolean},
    mapHash: {type: Number},
    isMaster: {type: Boolean},
    engagement: {type: Array},
    notifications: {type: Array},
});

export default mongoose.model('Course', Course, 'courses');
