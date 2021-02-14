"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Notification = new Schema({
    id: { type: Number },
    date: { type: Date },
    description: { type: String },
    title: { type: String },
    notification_type: { type: Number },
});
exports.default = mongoose_1.default.model('Notification', Notification, 'notifications');
//# sourceMappingURL=Notification.model.js.map