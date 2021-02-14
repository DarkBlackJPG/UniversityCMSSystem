import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProjectProposal = new Schema({
    id: {type: Number},
    title: {type: String},
    field: {type: String},
    mentor: {type: String},
    description: {type: String},
});

export default mongoose.model('ProjectProposal', ProjectProposal, 'project_proposals');
