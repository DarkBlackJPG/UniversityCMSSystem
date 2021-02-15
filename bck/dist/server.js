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
const Enrollment_API_1 = require("./API/Enrollment.API");
const Notification_API_1 = require("./API/Notification.API");
const Student_API_1 = require("./API/Student.API");
const Course_model_1 = __importDefault(require("./models/Course.model"));
const Course_model_2 = __importDefault(require("./models/Course.model"));
const Department_model_1 = __importDefault(require("./models/Department.model"));
const Employee_model_1 = __importDefault(require("./models/Employee.model"));
const EnrolledStudents_model_1 = __importDefault(require("./models/EnrolledStudents.model"));
const Notification_model_1 = __importDefault(require("./models/Notification.model"));
const NotificationTypes_model_1 = __importDefault(require("./models/NotificationTypes.model"));
const ProjectProposal_1 = __importDefault(require("./models/ProjectProposal"));
const Student_model_1 = __importDefault(require("./models/Student.model"));
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
router.route('/course/:id/get/enrolled/all').get((req, res) => {
    const courseId = req.params.id;
    const preparedStudents = [];
    EnrolledStudents_model_1.default.aggregate([
        {
            $match: {
                course_id: courseId,
            },
        }, {
            $lookup: {
                from: 'students',
                localField: 'user_id',
                foreignField: 'user_id',
                as: 'student_data',
            },
        }, {
            $unwind: {
                path: '$student_data',
                preserveNullAndEmptyArrays: true,
            },
        }, {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: 'id',
                as: 'user_data',
            },
        }, {
            $unwind: {
                path: '$user_data',
                preserveNullAndEmptyArrays: true,
            },
        },
    ], (error, users) => {
        if (error) {
            res.status(505).json(error);
            console.log(error.message);
        }
        else {
            for (let i = 0; i < users.length; i++) {
                const preparedStudent = new Student_API_1.StudentAPI();
                preparedStudent.id = users[i].user_id;
                preparedStudent.username = users[i].user_data.username;
                preparedStudent.name = users[i].user_data.name;
                preparedStudent.surname = users[i].user_data.surname;
                preparedStudent.email = users[i].user_data.email;
                preparedStudent.status = users[i].user_data.status;
                preparedStudent.type = users[i].user_data.type;
                preparedStudent.academicLevel = users[i].student_data.academicLevel;
                preparedStudent.index = users[i].student_data.index;
                preparedStudents.push(preparedStudent);
            }
            res.status(200).json(preparedStudents);
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
router.route('/projects/get/all/proposals').get((req, res) => {
    ProjectProposal_1.default.find({}, (error, projects) => {
        if (error) {
            res.status(505).json(error);
            console.log(error.message);
        }
        else {
            res.status(200).json(projects);
        }
    });
});
router.route('/titles/get/all').get((req, res) => {
    let titles = [];
    Title_model_1.default.find({}, (titleError, titleResult) => {
        if (titleError) {
            res.status(505).json(titleError);
            console.log(titleError.message);
        }
        else {
            titles = titleResult;
            res.status(200).json(titles);
        }
    });
});
router.route('/notifications/get/all/:id').get((req, res) => {
    const notificationType = req.params.id;
    let notificationTypesNames;
    NotificationTypes_model_1.default.find({ id: notificationType }, (error, types) => {
        if (error) {
            res.status(505).json(error);
            console.log(error.message);
        }
        else {
            notificationTypesNames = types;
        }
    }).then(() => {
        Notification_model_1.default.find({ notification_type: notificationType }, (error, notifications) => {
            if (error) {
                res.status(505).json(error);
                console.log(error.message);
            }
            else {
                const notifs = [];
                for (let i = 0; i < notifications.length; i++) {
                    const tempModel = new Notification_API_1.NotificationAPI();
                    tempModel.id = notifications[i].id;
                    tempModel.date = notifications[i].date;
                    tempModel.description = notifications[i].description;
                    tempModel.title = notifications[i].title;
                    tempModel.notification_type = notifications[i].notification_type;
                    tempModel.notification_type_name = notificationTypesNames.name;
                    notifs.push(tempModel);
                }
                res.status(200).json(notifs);
            }
        });
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
                            let myTitle;
                            for (const title of titles) {
                                if (title.id === titleId) {
                                    myTitle = title;
                                    break;
                                }
                            }
                            for (const user of users) {
                                if (user.id === employee.user_id) {
                                    preparedEmployee.name = user.name;
                                    preparedEmployee.surname = user.surname;
                                    preparedEmployee.email = user.email;
                                    preparedEmployee.status = user.status;
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
                            preparedEmployee.office = employee.office;
                            preparedEmployee.phonenumber = employee.phonenumber;
                            preparedEmployee.website = employee.website;
                            preparedEmployee.profilePicture = employee.profilePicture;
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
router.route('/course/student/enroll').post((req, res) => {
    const courseId = req.body.course_id;
    const studentIndex = req.body.student_index;
    const newData = new Enrollment_API_1.EnrollmentAPI();
    let student = null;
    Student_model_1.default.findOne({ index: studentIndex }, (err, stud) => {
        if (stud !== undefined) {
            student = new Student_API_1.StudentAPI();
            student.id = stud.user_id;
        }
        else {
            res.status(505).json({ message: 'Ne postoji' });
        }
    }).then(() => {
        if (student != null) {
            newData.user_id = student.id;
            newData.course_id = courseId;
            const newStudent = new EnrolledStudents_model_1.default(newData);
            newStudent.save((err, newStudent) => {
                if (err) {
                    console.log(err);
                    res.status(505).json({ message: 'Greska' });
                }
                else {
                    res.status(200).json({ message: 'ok' });
                    console.log(newStudent);
                }
            });
        }
        else {
            res.status(505).json({ message: 'Greska' });
        }
    });
});
router.route('/course/student/remove').post((req, res) => {
    const courseId = req.body.course_id;
    const studentIndex = req.body.student_index;
    let student = null;
    Student_model_1.default.findOne({ index: studentIndex }, (err, stud) => {
        if (stud !== undefined) {
            student = new Student_API_1.StudentAPI();
            student.id = stud.user_id;
        }
        else {
            res.status(505).json({ message: 'Ne postoji' });
        }
    }).then(() => {
        if (student === undefined) {
            res.status(505).json({ message: 'Ne postoji' });
        }
        else {
            EnrolledStudents_model_1.default.deleteOne({ course_id: courseId, user_id: student.id }).then(() => {
                res.status(200).json({ message: 'ok' });
                console.log('Data deleted');
            }).catch((error) => {
                res.status(505).json({ message: error });
                console.log(error); // Failure
            });
        }
    });
});
router.route('/course/create').post((req, res) => {
    const courseData = req.body.data;
    if (courseData.isMapped) {
        Course_model_2.default.find({
            coursecode: {
                $in: [
                    courseData.coursecode_SI,
                    courseData.coursecode_RTI,
                ],
            },
        }, (error, response) => {
            if (response.length === 0) {
                const newCourse = new Course_model_2.default({
                    id: -1,
                    name: courseData.name,
                    coursecode: courseData.coursecode_SI,
                    acronym: courseData.acronym,
                    semester: courseData.semester,
                    type: courseData.type ? 1 : 0,
                    department: 1,
                    courseDetails: [
                        {
                            conditions: courseData.conditions,
                            purpose: courseData.purpose,
                            outcome: courseData.outcome,
                            lectureDates: courseData.lectureDates,
                            auditoryExcercisesDates: courseData.auditoryExcercisesDates,
                            labInfo: courseData.labInfo,
                            homework: courseData.homeworks,
                            lectureNotes: [],
                            excercisesNotes: [],
                            labNotes: [],
                            homeworkNotes: [],
                        },
                    ],
                    isMapped: true,
                    mapHash: -1,
                    engagement: [],
                    isMaster: false,
                    notifications: [],
                });
                newCourse.save().then((doc) => {
                    if (newCourse) {
                        const newCourseRTI = new Course_model_2.default({
                            id: -1,
                            name: courseData.name,
                            coursecode: courseData.coursecode_RTI,
                            acronym: courseData.acronym,
                            semester: courseData.semester,
                            type: courseData.type ? 1 : 0,
                            department: 0,
                            courseDetails: [
                                {
                                    conditions: courseData.conditions,
                                    purpose: courseData.purpose,
                                    outcome: courseData.outcome,
                                    lectureDates: courseData.lectureDates,
                                    auditoryExcercisesDates: courseData.auditoryExcercisesDates,
                                    labInfo: courseData.labInfo,
                                    homework: courseData.homeworks,
                                    lectureNotes: [],
                                    excercisesNotes: [],
                                    labNotes: [],
                                    homeworkNotes: [],
                                },
                            ],
                            isMapped: true,
                            mapHash: -1,
                            engagement: [],
                            isMaster: false,
                            notifications: [],
                        });
                        newCourseRTI.save().then((resp) => {
                            if (newCourseRTI) {
                                res.status(505).json({ message: 'ok' });
                            }
                            else {
                                res.status(505).json({ message: 'Nesto nije dobrt' });
                            }
                        });
                    }
                    else {
                        res.status(505).json({ message: 'Nesto nije dobrt' });
                    }
                });
            }
            else {
                res.status(505)
                    .json({ message: 'Kurs sa ovom sifrom vec postoji (sifra je ista ili za RTI smer ili za SI smer)' });
                console.log(error); // Failure
            }
        });
    }
    else {
        let courseCode = '';
        let dept = -1;
        if (courseData.isSI) {
            dept = 1;
            courseCode = courseData.coursecode_SI;
        }
        else {
            dept = 0;
            courseCode = courseData.coursecode_RTI;
        }
        Course_model_2.default.find({
            coursecode: {
                $in: [
                    courseCode,
                ],
            },
        }, (error, response) => {
            if (response.length === 0) {
                const newCourse = new Course_model_2.default({
                    id: -1,
                    name: courseData.name,
                    coursecode: courseCode,
                    acronym: courseData.acronym,
                    semester: courseData.semester,
                    type: courseData.type ? 1 : 0,
                    department: dept,
                    courseDetails: [
                        {
                            conditions: courseData.conditions,
                            purpose: courseData.purpose,
                            outcome: courseData.outcome,
                            lectureDates: courseData.lectureDates,
                            auditoryExcercisesDates: courseData.auditoryExcercisesDates,
                            labInfo: courseData.labInfo,
                            homework: courseData.homeworks,
                            lectureNotes: [],
                            excercisesNotes: [],
                            labNotes: [],
                            homeworkNotes: [],
                        },
                    ],
                    isMapped: false,
                    mapHash: -1,
                    engagement: [],
                    isMaster: courseData.isMaster,
                    notifications: [],
                });
                newCourse.save().then((doc) => {
                    if (newCourse) {
                        res.status(200).json({ message: 'ok' });
                    }
                    else {
                        res.status(505).json({ message: 'Nesto nije dobrt' });
                    }
                });
            }
            else {
                res.status(505)
                    .json({ message: 'Kurs sa ovom sifrom vec postoji' });
                console.log(error); // Failure
            }
        });
    }
});
router.route('/course/engagement/update').post((req, res) => {
    const courseId = req.body.course_id;
    const engagement = req.body.engagement;
    Course_model_2.default.findOne({
        coursecode: courseId,
    }, (error, course) => {
        if (error) {
            res.status(505).json({ message: error });
            console.log(error); // Failure
        }
        else {
            if (course !== undefined) {
                Course_model_2.default.collection.updateOne({ coursecode: courseId }, {
                    $push: {
                        engagement,
                    },
                });
                res.status(200).json({ message: 'ok' });
            }
            else {
                res.status(505).json({ message: 'Greska' });
                console.log(error); // Failure
            }
        }
    });
});
router.route('/course/:id/get/engagement').get((req, res) => {
    const courseId = req.params.id;
    Course_model_2.default.findOne({
        coursecode: courseId,
    }, (error, course) => {
        if (error) {
            res.status(505).json({ message: error });
            console.log(error); // Failure
        }
        else {
            if (course !== null && course !== undefined) {
                res.status(200).json(course.engagement);
            }
            else {
                res.status(200).json([]);
            }
        }
    });
});
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map