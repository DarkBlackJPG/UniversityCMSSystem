"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const User_model_1 = __importDefault(require("./models/User.model"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default());
mongoose_1.default.connect('mongodb://localhost:27017/PIAdb');
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log('MongoDB Connection open!');
});
const router = express_1.default.Router();
router.route('/login').post((request, response) => {
    console.log('Login request accepted!');
    let username = request.body.username;
    let password = request.body.password;
    User_model_1.default.findOne({
        username: username,
        password: password,
    }, (error, user) => {
        if (error) {
            response.status(505).json(error);
            console.log(error.message);
        }
        else {
            response.status(200).json(user);
        }
    });
});
router.route('/register').post((request, response) => {
    console.log('Register request accepted!');
    let user = new User_model_1.default(request.body);
    User_model_1.default.findOne({ 'username': request.body.username }, (error, userFound) => {
        if (error) {
            response.status(505).json(error);
            console.log(error.message);
        }
        else {
            if (userFound) {
                response.status(505).json({ 'isSuccessful': 0 });
            }
            else {
                user.save().then((doc) => {
                    if (user) {
                        response.status(200).json({ 'isSuccessful': 1 });
                    }
                    else {
                        response.status(505).json({ 'isSuccessful': 0 });
                    }
                });
            }
        }
    });
});
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map