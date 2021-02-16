import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const User = new Schema( {
    username: {
        type: String,
    },
    id: {
        type: Number,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
    },
    surname: {
        type: String,
    },
    email: {
        type: String,
    },
    status: {
        type: Number,
    },
    type: {
        type: Number,
    },
    active: {
        type: Boolean,
    },
});

export default mongoose.model('User', User, 'users');
