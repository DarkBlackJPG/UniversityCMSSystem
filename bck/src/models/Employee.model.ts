import mongoose from 'mongoose';
import Course from './Course.model';

const Schema = mongoose.Schema;

const Employee = new Schema({
    user_id: {type: Number},
    address: {type: String},
    phonenumber: {type: String},
    website: {type: String},
    biography: {type: String},
    title: {type: Number},
    office: {type: String},
    courses: {type: Array},
});

export default mongoose.model('Employee', Employee, 'employees');
