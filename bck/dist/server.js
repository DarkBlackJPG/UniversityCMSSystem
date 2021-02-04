"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Employee_API_1 = require("./API/Employee.API");
const Course_model_1 = __importDefault(require("./models/Course.model"));
const Department_model_1 = __importDefault(require("./models/Department.model"));
const Employee_model_1 = __importDefault(require("./models/Employee.model"));
const Title_model_1 = __importDefault(require("./models/Title.model"));
const User_model_1 = __importDefault(require("./models/User.model"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default());
mongoose_1.default.connect('mongodb://localhost:27017/PIA_Proj');
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log('MongoDB Connection open!');
});
const router = express_1.default.Router();
router.route('/login').post((request, response) => {
    console.log('Login request accepted!');
    const username = request.body.username;
    const password = request.body.password;
    User_model_1.default.findOne({
        password,
        username,
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
    const user = new User_model_1.default(request.body);
    User_model_1.default.findOne({ username: request.body.username }, (error, userFound) => {
        if (error) {
            response.status(505).json(error);
            console.log(error.message);
        }
        else {
            if (userFound) {
                response.status(505).json({ isSuccessful: 0 });
            }
            else {
                user.save().then((doc) => {
                    if (user) {
                        response.status(200).json({ isSuccessful: 1 });
                    }
                    else {
                        response.status(505).json({ isSuccessful: 0 });
                    }
                });
            }
        }
    });
});
router.route('/course/get/ids').get((req, res) => {
    Course_model_1.default.find({}, (error, course) => {
        if (error) {
            res.status(505).json(error);
            console.log(error.message);
        }
        else {
            res.status(200).json(course);
        }
    });
});
router.route('/department/get/ids').get((req, res) => {
    Department_model_1.default.find({}, (error, department) => {
        if (error) {
            res.status(505).json(error);
            console.log(error.message);
        }
        else {
            res.status(200).json(department);
        }
    });
});
router.route('/department/course/info/get/:id').get((req, res) => {
    const depId = req.params.id;
    Course_model_1.default.find({ department: depId }, (error, department) => {
        if (error) {
            res.status(505).json(error);
            console.log(error.message);
        }
        else {
            res.status(200).json(department);
        }
    });
});
router.route('/employees/get/all').get((req, res) => {
    let courses = [];
    let titles = [];
    let users = [];
    User_model_1.default.find({}, (userError, userResult) => {
        if (userError) {
            res.status(505).json(userError);
            console.log(userError.message);
        }
        else {
            users = userResult;
        }
    }).then(() => {
        Course_model_1.default.find({}, (courseError, coursesResult) => {
            if (courseError) {
                res.status(505).json(courseError);
                console.log(courseError.message);
            }
            else {
                courses = coursesResult;
            }
        }).then(() => {
            Title_model_1.default.find({}, (titleError, titleResult) => {
                if (titleError) {
                    res.status(505).json(titleError);
                    console.log(titleError.message);
                }
                else {
                    titles = titleResult;
                }
            }).then(() => {
                Employee_model_1.default.find({}, (employeeError, employeeResult) => {
                    if (employeeError) {
                        res.status(505).json(employeeError);
                        console.log(employeeError.message);
                    }
                    else {
                        const preparedEmployees = [];
                        for (const employee of employeeResult) {
                            const preparedEmployee = new Employee_API_1.EmployeeAPI();
                            const titleId = Number(employee.title);
                            const myTitle = titles.find((value, index) => {
                                return value.id === index;
                            }, titleId);
                            for (const user of users) {
                                if (user.id === employee.user_id) {
                                    preparedEmployee.name = user.name;
                                    preparedEmployee.surname = user.surname;
                                    preparedEmployee.email = user.email;
                                }
                            }
                            const myCourses = [];
                            for (const course of employee.courses) {
                                // tslint:disable-next-line:prefer-const
                                let tempCourse;
                                for (let i = 0; i < courses.length; i++) {
                                    if (course.id === courses[i].id) {
                                        tempCourse = courses[i];
                                        myCourses.push(tempCourse);
                                        break;
                                    }
                                }
                            }
                            preparedEmployee.user_id = employee.user_id;
                            preparedEmployee.address = employee.address;
                            preparedEmployee.phonenumber = employee.phonenumber;
                            preparedEmployee.website = employee.website;
                            preparedEmployee.biography = employee.biography;
                            preparedEmployee.title = myTitle.name;
                            preparedEmployee.educational = myTitle.educational;
                            preparedEmployee.courses = myCourses;
                            preparedEmployees.push(preparedEmployee);
                        }
                        res.status(200).json(preparedEmployees);
                    }
                });
            });
        });
    });
});
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map