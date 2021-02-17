"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// @ts-ignore
const file_extension_1 = __importDefault(require("file-extension"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
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
const User_model_2 = __importDefault(require("./models/User.model"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default());
mongoose_1.default.connect('mongodb://localhost:27017/PIA_Proj');
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log('MongoDB Connection open!');
});
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, 'file_upload');
    },
    filename(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file_extension_1.default(file.originalname));
    },
});
const upload = multer_1.default({ storage }).single('file');
router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
        }
        console.log(req);
        res.json({
            message: 'ok',
            // tslint:disable-next-line:object-literal-sort-keys
            file_data: req.file,
            file_extension: file_extension_1.default(req.file.originalname),
        });
        // Everything went fine
    });
});
router.post('/courses/notifications/upload', (req, res) => {
    const courseId = req.body.courseId;
    const notification = req.body.notification;
    console.log(req.body);
    Course_model_2.default.aggregate([
        {
            $match: {
                id: courseId,
            },
        },
        {
            $unwind: {
                path: '$notifications',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $sort: {
                'notifications.id': -1.0,
            },
        },
    ], (error, users) => {
        let lastIndex = users[0].notifications === undefined ? 0 : Number(users[0].notifications.id);
        lastIndex++;
        Course_model_2.default.updateOne({
            id: courseId,
        }, {
            $push: {
                notifications: {
                    id: lastIndex,
                    title: notification.title,
                    description: notification.description,
                    date: notification.date,
                    file: notification.file,
                },
            },
        }, null, ((err, raw) => {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).json({ message: 'ok' });
            }
        }));
    });
});
router.post('/download', (req, res) => {
    const filename = req.body.filename;
    res.sendFile('file_upload/' + filename, { root: __dirname + '/../' });
});
router.get('/courses/notifications/:id', (req, res) => {
    const courseId = req.params.id;
    Course_model_2.default.findOne({
        id: courseId,
    }, (error, myCourse) => {
        if (error) {
            console.log(error);
        }
        else {
            res.status(200).json(myCourse.notifications);
        }
    });
});
router.route('/employee/:id/my_courses/get/all').get((req, res) => {
    const employeeId = req.params.id;
    console.log(employeeId);
    Employee_model_1.default.aggregate([
        {
            $match: {
                user_id: 1.0,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'courses.coursecode',
                foreignField: 'coursecode',
                as: 'courses_data',
            },
        },
    ], (error, users) => {
        if (error) {
            console.log(error);
        }
        else {
            res.status(200).json(users[0].courses_data);
        }
    });
});
router.route('/login').post((request, response) => {
    console.log('Login request accepted!');
    const username = request.body.username;
    const password = request.body.password;
    User_model_1.default.findOne({
        password,
        username,
        status: 1,
    }, (error, user) => {
        if (error) {
            response.status(505).json(error);
            console.log(error.message);
        }
        else {
            if (user !== undefined) {
                if (user.type === 0) {
                    response.status(200).json({
                        id: user.id,
                        type: user.type,
                        username: user.username,
                        name: user.name,
                        surname: user.surname,
                    });
                }
                else if (user.type === 1) {
                    User_model_2.default.aggregate([
                        {
                            $match: {
                                id: user.id,
                            },
                        }, {
                            $lookup: {
                                from: 'employees',
                                localField: 'id',
                                foreignField: 'user_id',
                                as: 'employee_data',
                            },
                        }, {
                            $unwind: {
                                path: '$employee_data',
                                preserveNullAndEmptyArrays: true,
                            },
                        }, {
                            $lookup: {
                                from: 'employee_types',
                                localField: 'employee_data.title',
                                foreignField: 'id',
                                as: 'title',
                            },
                        }, {
                            $unwind: {
                                path: '$title',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ], (err, users) => {
                        response.status(200).json(users[0]);
                    });
                }
                else if (user.type === 2) {
                    User_model_2.default.aggregate([
                        {
                            $match: {
                                id: user.id,
                            },
                        }, {
                            $lookup: {
                                from: 'students',
                                localField: 'id',
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
                                from: 'enrolled_students',
                                localField: 'id',
                                foreignField: 'user_id',
                                as: 'enrollment_data',
                            },
                        }, {
                            $unwind: {
                                path: '$enrollment_data',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ], (err, users) => {
                        response.status(200).json(users[0]);
                    });
                }
            }
            else {
                response.status(500);
            }
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
router.route('/notifications/types/get/all').get((req, res) => {
    NotificationTypes_model_1.default.find({}, (error, types) => {
        if (error) {
            console.log(error);
        }
        else {
            res.status(200).json(types);
        }
    });
});
router.route('/notifications/types/remove').post((req, res) => {
    const typeId = req.body.data;
    NotificationTypes_model_1.default.deleteOne({ id: typeId }).then(() => {
        Notification_model_1.default.deleteOne({
            notification_type: typeId,
        }).then(() => {
            res.status(200).json({ message: 'ok' });
        });
    });
});
router.route('/notifications/remove').post((req, res) => {
    const id = req.body.data;
    Notification_model_1.default.deleteOne({
        id,
    }).then(() => {
        res.status(200).json({ message: 'ok' });
    });
});
router.route('/notifications/types/update').post((req, res) => {
    const notification = req.body.data;
    NotificationTypes_model_1.default.updateOne({
        id: notification.id,
    }, {
        $set: {
            name: notification.name,
        },
    }, null, (err, raw) => {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).json({ message: 'ok' });
        }
    });
});
router.route('/notifications/update').post((req, res) => {
    const notification = req.body.data;
    Notification_model_1.default.updateOne({
        id: notification.id,
    }, {
        $set: {
            date: notification.id,
            description: notification.description,
            notification_type: notification.notification_type,
            title: notification.title,
        },
    }, null, (err, raw) => {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).json({ message: 'ok' });
        }
    });
});
router.route('/notifications/add').post((req, res) => {
    const notification = req.body.data;
    let lastIndex = -1;
    Notification_model_1.default
        .findOne({})
        .sort('-id') // give me the max
        .exec((err, member) => {
        lastIndex = member.id;
        lastIndex++;
        const newNotificationType = new Notification_model_1.default({
            id: lastIndex,
            date: notification.date,
            description: notification.description,
            notification_type: notification.notification_type,
            title: notification.title,
        });
        newNotificationType.save((err1, product) => {
            if (err1) {
                console.log(err1);
            }
            else {
                res.status(200).json({ message: 'ok' });
            }
        });
    });
});
router.route('/notifications/types/add').post((req, res) => {
    const notificationType = req.body.data;
    let lastIndex = -1;
    NotificationTypes_model_1.default
        .findOne({})
        .sort('-id') // give me the max
        .exec((err, member) => {
        lastIndex = member.id;
        lastIndex++;
        const newNotificationType = new NotificationTypes_model_1.default({
            id: lastIndex,
            name: notificationType.name,
        });
        newNotificationType.save((err1, product) => {
            if (err1) {
                console.log(err1);
            }
            else {
                res.status(200).json({ message: 'ok' });
            }
        });
    });
});
router.route('/employees/get/all').get((req, res) => {
    User_model_2.default.aggregate([
        {
            $match: {
                type: 1.0,
            },
        },
        {
            $lookup: {
                from: 'employees',
                localField: 'id',
                foreignField: 'user_id',
                as: 'employee_data',
            },
        },
        {
            $unwind: {
                path: '$employee_data',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'employee_data.courses.coursecode',
                foreignField: 'coursecode',
                as: 'course_data',
            },
        },
        {
            $lookup: {
                from: 'employee_types',
                localField: 'employee_data.title',
                foreignField: 'id',
                as: 'title',
            },
        },
        {
            $unwind: {
                path: '$title',
                preserveNullAndEmptyArrays: true,
            },
        },
    ], (err, das) => {
        console.log(err);
        res.status(200).json(das);
    });
});
router.route('/employees/update').post((req, res) => {
    const employee = req.body.data;
    User_model_2.default.findOne({
        id: employee.id,
        type: employee.type,
    }, (err, doc) => {
        if (doc !== undefined) {
            User_model_2.default.updateOne({
                id: employee.id,
            }, {
                $set: {
                    name: employee.name,
                    surname: employee.surname,
                    email: employee.email,
                    status: employee.status,
                },
            }).then(() => {
                Employee_model_1.default.updateOne({
                    user_id: employee.id,
                }, {
                    $set: {
                        profilePicture: 'default.jpg',
                        address: employee.employee_data.address,
                        website: employee.employee_data.website,
                        phonenumber: employee.employee_data.phonenumber,
                        biography: employee.employee_data.biography,
                        title: employee.title.id,
                    },
                }).then(() => {
                    res.status(200).json({ message: 'ok' });
                });
            });
        }
        else {
            res.status(200).json({ message: 'Korisnik ne postoji!' });
        }
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
    let lastIndex = -1;
    Course_model_2.default
        .findOne({})
        .sort('-id') // give me the max
        .exec((err, member) => {
        lastIndex = member.id;
        const coursesToInsert = req.body.data;
        const coursenames = [];
        lastIndex++;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < coursesToInsert.length; i++) {
            coursesToInsert[i].mapHash = lastIndex;
            coursenames.push(coursesToInsert[i].coursecode);
        }
        Course_model_2.default.find({ coursecode: { $in: coursenames } }).then((founds) => __awaiter(void 0, void 0, void 0, function* () {
            if (founds.length === 0) {
                for (let i = 0; i < coursesToInsert.length; i++) {
                    coursesToInsert[i].id = lastIndex++;
                    const newCourse = new Course_model_2.default(coursesToInsert[i]);
                    yield newCourse.save();
                }
                res.status(200).json({ message: 'ok' });
            }
            else {
                res.status(200).json({ message: 'Kurs sa definisanim imenom postoji!' });
            }
        }));
    });
});
router.route('/course/update').post((req, res) => {
    console.log(JSON.stringify(req.body));
    const courseData = req.body.data;
    courseData.type = req.body.data.type === true ? 1 : 0;
    const courseCode = req.body.coursecode;
    Course_model_2.default.find({
        coursecode: {
            $in: [
                courseCode,
                courseData.coursecode,
            ],
        },
    }, (error, response) => {
        if (response.length !== 1) {
            res.status(200).json({ message: 'Kurs sa definisanim imenom postoji!' });
        }
        else {
            if (response[0].coursecode === courseCode) {
                Course_model_2.default.updateOne({
                    coursecode: courseCode,
                }, {
                    $set: {
                        'name': courseData.name,
                        'coursecode': courseData.coursecode,
                        'acronym': courseData.acronym,
                        'semester': courseData.semester,
                        'type': courseData.type,
                        'department': courseData.department,
                        'courseDetails.0': courseData.courseDetails[0],
                        'isMaster': courseData.isMaster,
                    },
                }).then((doc) => {
                    res.status(200).json({ message: 'ok' });
                });
            }
            else {
                res.status(200).json({ message: 'Kurs sa definisanim imenom postoji!' });
            }
        }
    });
});
router.route('/course/engagement/update').post((req, res) => {
    const courseId = req.body.course_id;
    const engagement = req.body.engagement;
    console.log(engagement);
    Course_model_2.default.findOne({
        coursecode: courseId,
    }, (error, course) => {
        if (error) {
            res.status(505).json({ message: error });
            console.log(error); // Failure
        }
        else {
            if (course !== undefined) {
                Course_model_2.default.updateOne({ coursecode: courseId }, {
                    $set: {
                        engagement,
                    },
                }).then(() => {
                    const lecturersSet = new Set();
                    for (let i = 0; i < engagement.length; i++) {
                        lecturersSet.add(Number(engagement[i].lectureLecturer));
                        lecturersSet.add(Number(engagement[i].auditoryExcercisesLecturer));
                    }
                    Employee_model_1.default.find({}, (errorEmployee, employees) => __awaiter(void 0, void 0, void 0, function* () {
                        for (let i = 0; i < employees.length; i++) {
                            const employeeCourses = employees[i].courses;
                            const kurcina = [];
                            for (let j = 0; j < employeeCourses.length; j++) {
                                if (String(employeeCourses[j].coursecode) != String(courseId)) {
                                    kurcina.push({ coursecode: employeeCourses[j].coursecode });
                                }
                            }
                            if (lecturersSet.has(Number(employees[i].user_id))) {
                                console.log(employees[i].user_id);
                                kurcina.push({ coursecode: courseId });
                            }
                            yield Employee_model_1.default.updateOne({ user_id: employees[i].user_id }, {
                                $set: {
                                    courses: kurcina,
                                },
                            }).then(() => {
                                console.log(employeeCourses);
                            });
                        }
                        res.status(200).json({ message: 'ok' });
                    }));
                });
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
router.route('/students/create/new').post((req, res) => {
    const userData = req.body.data;
    let lastIndex = -1;
    User_model_2.default
        .findOne({})
        .sort('-id') // give me the max
        .exec((err, member) => {
        lastIndex = member.id;
        User_model_2.default.find({ username: userData.username }, (error, document) => {
            if (document.length !== 0) {
                res.status(200).json({ message: 'Korisnik vec postoji!' });
            }
            else {
                lastIndex++;
                const newUser = new User_model_2.default({
                    id: lastIndex,
                    username: userData.username,
                    password: userData.password,
                    name: userData.name,
                    surname: userData.surname,
                    email: userData.username,
                    status: userData.active,
                    type: 2,
                });
                const newStudent = new Student_model_1.default({
                    user_id: lastIndex,
                    index: userData.index,
                    academic_level: userData.type,
                    verify: userData.verifyPassword,
                });
                newUser.save().then(() => newStudent.save().then(() => {
                    res.status(200).json({ message: 'ok' });
                }));
            }
        });
    });
});
router.route('/employees/create/new').post((req, res) => {
    const userData = req.body.data;
    let lastIndex = -1;
    User_model_2.default
        .findOne({})
        .sort('-id') // give me the max
        .exec((err, member) => {
        lastIndex = member.id;
        User_model_2.default.find({ username: userData.username }, (error, document) => {
            if (document.length !== 0) {
                res.status(200).json({ message: 'Korisnik vec postoji!' });
            }
            else {
                lastIndex++;
                const newUser = new User_model_2.default({
                    id: lastIndex,
                    username: userData.username,
                    password: userData.password,
                    name: userData.name,
                    surname: userData.surname,
                    email: userData.email,
                    status: userData.active,
                    type: 1,
                });
                const newEmployee = new Employee_model_1.default({
                    user_id: lastIndex,
                    address: userData.address,
                    phonenumber: userData.phonenumber,
                    website: userData.website,
                    biography: userData.bio,
                    profilePicture: 'default.jpg',
                    title: userData.title.id,
                    office: userData.office,
                    courses: [],
                });
                newUser.save().then(() => newEmployee.save().then(() => {
                    res.status(200).json({ message: 'ok' });
                }));
            }
        });
    });
});
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map