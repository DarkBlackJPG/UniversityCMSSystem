import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Title = new Schema( {
    id: {
        type: Number,
    },
    // tslint:disable-next-line:object-literal-sort-keys
    educational: {
        type: Number,
    },
    name: {
        type: String,
    },
});

export default mongoose.model('Title', Title, 'employee_types');
