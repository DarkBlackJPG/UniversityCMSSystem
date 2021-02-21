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
    exams: {type: Array, default: []},
    excercises: {type: Array, default: []},
    labs_docs: {type: Array, default: []},
    labs_texts: {type: Array, default: []},
    lectures: {type: Array, default: []},
    projects_docs: {type: Array, default: []},
    projects_texts: {type: Array, default: []},
    exams_visible: {type: Boolean, default: true},
    project_visible: {type: Boolean, default: true},
    lab_visible: {type: Boolean, default: true},
});

export default mongoose.model('Course', Course, 'courses');
