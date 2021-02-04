"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const User = new Schema({
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
});
exports.default = mongoose_1.default.model('User', User, 'users');
//# sourceMappingURL=User.model.js.map