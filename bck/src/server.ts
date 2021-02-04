import bodyParser from 'body-parser';
import cors from 'cors';
import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import {CourseAPI} from './API/CourseAPI';
import {EmployeeAPI} from './API/Employee.API';
import {TitleAPI} from './API/TitleAPI';
import CourseModel from './models/Course.model';
import Course from './models/Course.model';
import Department from './models/Department.model';
import Employee from './models/Employee.model';
import Title from './models/Title.model';
import UserModel from './models/User.model';
import {UsersAPI} from "./API/Users.API";

const app = express();

app.use(cors());
app.use(bodyParser());

mongoose.connect('mongodb://localhost:27017/PIA_Proj');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB Connection open!');
});

const router = express.Router();

router.route('/login').post(
    (request: Request, response: Response) => {
        console.log('Login request accepted!');

        const username = request.body.username;
        const password = request.body.password;

        UserModel.findOne(
            {
                password,
                username,
            },
            (error: Error, user: any) => {
                if (error) {
                    response.status(505).json(error);
                    console.log(error.message);
                } else {
                    response.status(200).json(user);
                }
            },
        );

    },
);

router.route('/register').post(
    (request: Request, response: Response) => {
        console.log('Register request accepted!');

        const user = new UserModel(request.body);
        UserModel.findOne(
            {username: request.body.username},
            (error: Error, userFound: any) => {
                if (error) {
                    response.status(505).json(error);
                    console.log(error.message);
                } else {
                    if (userFound) {
                        response.status(505).json({isSuccessful: 0});
                    } else {
                        user.save().then(
                            (doc: any) => {
                                if (user) {
                                    response.status(200).json({isSuccessful: 1});
                                } else {
                                    response.status(505).json({isSuccessful: 0});
                                }
                            });
                    }

                }
            },
        );
    },
);

router.route('/course/get/ids').get(
    (req, res) => {
        CourseModel.find({},
            (error, course) => {
                if (error) {
                    res.status(505).json(error);
                    console.log(error.message);
                } else {
                    res.status(200).json(course);
                }
            });
    });

router.route('/department/get/ids').get(
    (req, res) => {
        Department.find({},
            (error, department) => {
                if (error) {
                    res.status(505).json(error);
                    console.log(error.message);
                } else {
                    res.status(200).json(department);
                }
            });
    });
router.route('/department/course/info/get/:id').get(
    (req, res) => {
        const depId = req.params.id;

        CourseModel.find({department: depId},
            (error, department) => {
                if (error) {
                    res.status(505).json(error);
                    console.log(error.message);
                } else {
                    res.status(200).json(department);
                }
            });
    });
router.route('/employees/get/all').get(
    (req, res) => {
        let courses: CourseAPI[] = [];
        let titles: TitleAPI[] = [];
        let users: UsersAPI[] = [];

        UserModel.find({},
            (userError, userResult: UsersAPI[]) => {
                if (userError) {
                    res.status(505).json(userError);
                    console.log(userError.message);
                } else {
                    users = userResult;
                }
            }).then(() => {

            CourseModel.find({},
                (courseError, coursesResult: CourseAPI[]) => {
                    if (courseError) {
                        res.status(505).json(courseError);
                        console.log(courseError.message);
                    } else {
                        courses = coursesResult;
                    }
                }).then(() => {
                Title.find({},
                    (titleError, titleResult: TitleAPI[]) => {
                        if (titleError) {
                            res.status(505).json(titleError);
                            console.log(titleError.message);
                        } else {
                            titles = titleResult;
                        }
                    }).then(() => {
                    Employee.find({},
                        (employeeError, employeeResult: EmployeeAPI[]) => {
                            if (employeeError) {
                                res.status(505).json(employeeError);
                                console.log(employeeError.message);
                            } else {
                                const preparedEmployees: EmployeeAPI[] = [];
                                for (const employee of employeeResult) {
                                    const preparedEmployee: EmployeeAPI = new EmployeeAPI();
                                    const titleId: number = Number(employee.title);
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

                                    const myCourses: CourseAPI[] = [];

                                    for (const course of employee.courses) {
                                        // tslint:disable-next-line:prefer-const
                                        let tempCourse: CourseAPI;
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
