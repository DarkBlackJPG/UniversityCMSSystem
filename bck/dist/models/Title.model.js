"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Title = new Schema({
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
exports.default = mongoose_1.default.model('Title', Title, 'employee_types');
//# sourceMappingURL=Title.model.js.map