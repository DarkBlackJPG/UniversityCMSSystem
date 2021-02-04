import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Department = new Schema( {
    id: {
        type: Number,
    },
    name: {
        type: String,
    },
    acronym: {
        type: String,
    },
});

export default mongoose.model('Department', Department, 'department');
