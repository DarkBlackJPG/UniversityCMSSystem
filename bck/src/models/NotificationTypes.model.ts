import mongoose from 'mongoose';
import Course from './Course.model';

const Schema = mongoose.Schema;

const NotificationType = new Schema({
    id: {type: Number},
    name: {type: String},
});

export default mongoose.model('NotificationType', NotificationType, 'notification_types');
