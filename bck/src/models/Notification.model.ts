import mongoose from 'mongoose';
import Course from './Course.model';

const Schema = mongoose.Schema;

const Notification = new Schema({
    id: {type: Number},
    date: {type: Date},
    description: {type: String},
    title: {type: String},
    notification_type: {type: Number},
});

export default mongoose.model('Notification', Notification, 'notifications');
