"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ProjectProposal = new Schema({
    id: { type: Number },
    title: { type: String },
    field: { type: String },
    mentor: { type: String },
    description: { type: String },
});
exports.default = mongoose_1.default.model('ProjectProposal', ProjectProposal, 'project_proposals');
//# sourceMappingURL=ProjectProposal.js.map