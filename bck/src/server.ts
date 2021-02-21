import * as assert from 'assert';
import {log} from 'async';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, {Request, Response} from 'express';
// @ts-ignore
import fileExtension from 'file-extension';
import mongoose from 'mongoose';
import multer from 'multer';
import * as path from 'path';
import {CourseAPI} from './API/CourseAPI';
import {EmployeeAPI} from './API/Employee.API';
import {EmployeeRegistrationAPI} from './API/EmployeeRegistration.API';
import {EnrollmentAPI} from './API/Enrollment.API';
import {NewCourseData} from './API/NewCourseData.API';
import {NotificationAPI} from './API/Notification.API';
import {NotificationTypesAPI} from './API/NotificationTypes.API';
import {StudentAPI} from './API/Student.API';
import {TitleAPI} from './API/TitleAPI';
import {UserRegistrationDataAPI} from './API/UserRegistrationData.API';
import {UsersAPI} from './API/Users.API';
import CourseModel from './models/Course.model';
import Course from './models/Course.model';
import CourseRegistrationList from './models/CourseRegistrationLists';
import Department from './models/Department.model';
import Employee from './models/Employee.model';
import EnrolledStudents from './models/EnrolledStudents.model';
import Notification from './models/Notification.model';
import NotificationType from './models/NotificationTypes.model';
import ProjectProposal from './models/ProjectProposal';
import Student from './models/Student.model';
import Title from './models/Title.model';
import UserModel from './models/User.model';
import User from './models/User.model';

const app = express();

app.use(cors());
app.use(bodyParser());

mongoose.connect('mongodb://localhost:27017/PIA_Proj');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB Connection open!');
});

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'file_upload');
    },
    filename(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname));
    },
});

const upload = multer({storage}).single('file');

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
            file_extension: fileExtension(req.file.originalname),
        });
        // Everything went fine
    });
});

router.post('/courses/notifications/upload', (req, res) => {
    const courseId = req.body.courseId;
    const notification = req.body.notification;
    console.log(req.body);
    Course.aggregate([
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
    ], (error: Error, users: any[]) => {
        let lastIndex = users[0].notifications === undefined ? 0 : Number(users[0].notifications.id);
        lastIndex++;
        Course.updateOne({
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
            } else {
                res.status(200).json({message: 'ok'});
            }
        }));
    });

});
router.post('/courses/notifications/update', (req, res) => {
    const courseId = req.body.courseId;
    const notification = req.body.notification;
    console.log(notification);
    Course.updateOne({
        'id': courseId,
        'notifications.id': notification.id,
    }, {
        $set: {
            'notifications.$': notification,
        },
    }, null, (err, raw) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({message: 'ok'});
        }
    });
});
router.get('/download/:id', (req, res) => {
    const filename = req.params.id;
    res.sendFile('file_upload/' + filename, {root: __dirname + '/../'});
});
router.get('/courses/:id/registration_lists/get/all', (req, res) => {
    const courseId = req.params.id;

    CourseRegistrationList.find({
        course_id: courseId,
        isActive: true,
        date_close: {
            $gte: new Date(),
        },
    }, (err, resp) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(resp);
        }
    });
});

router.get('/courses/notifications/:id', (req, res) => {
    const courseId = req.params.id;
    Course.findOne(
        {
            id: courseId,
        },
        (error: Error, myCourse: CourseAPI) => {
            if (error) {
                console.log(error);
            } else {
                res.status(200).json(myCourse.notifications);
            }
        });
});

router.route('/employee/:id/my_courses/get/all').get((req, res) => {
    const employeeId = Number(req.params.id);
    console.log(employeeId);
    Employee.aggregate([
        {
            $match: {
                user_id: employeeId,
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
    ], (error: Error, users: any) => {
        if (error) {
            console.log(error);
        } else {
            res.status(200).json(users[0].courses_data);
        }
    });
});

router.route('/login').post(
    (request: Request, response: Response) => {
        console.log('Login request accepted!');
        const username = request.body.username;
        const password = request.body.password;

        UserModel.findOne(
            {
                password,
                username,
                status: 1,
            },
            (error: Error, user: UsersAPI) => {
                if (error) {
                    response.status(505).json(error);
                    console.log(error.message);
                } else {
                    if (user !== null) {
                        console.log(user);
                        if (user.type === 0) {
                            response.status(200).json({
                                id: user.id,
                                type: user.type,
                                username: user.username,
                                name: user.name,
                                surname: user.surname,
                            });
                        } else if (user.type === 1) {
                            User.aggregate([
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

                            ], (err: Error, users: any[]) => {
                                response.status(200).json(users[0]);
                            });
                        } else if (user.type === 2) {
                            User.aggregate([
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
                            ], (err: Error, users: any[]) => {
                                response.status(200).json(users[0]);
                            });
                        }
                    } else {
                        response.status(200).json({message: 'Korisnik ne postoji'});
                    }
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

router.route('/course/:id/get/enrolled/all').get(
    (req, res) => {
        const courseId = req.params.id;
        const preparedStudents: StudentAPI[] = [];

        EnrolledStudents.aggregate([
            {
                $match : {
                    course_id : '13S112AOR',
                },
            },
            {
                $lookup : {
                    from : 'students',
                    localField : 'student_id',
                    foreignField : 'user_id',
                    as : 'student_data',
                },
            },
            {
                $unwind : {
                    path : '$student_data',
                    preserveNullAndEmptyArrays : true,
                },
            },
            {
                $lookup : {
                    from : 'users',
                    localField : 'student_id',
                    foreignField : 'id',
                    as : 'user_data',
                },
            },
            {
                $unwind : {
                    path : '$user_data',
                    preserveNullAndEmptyArrays : true,
                },
            },
        ], (error: Error, users: any[]) => {
            if (error) {
                console.log(error.message);
            } else {
                console.log(users);
                for (let i = 0; i < users.length; i++) {
                    const preparedStudent = new StudentAPI();

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
router.route('/projects/get/all/proposals').get(
    (req, res) => {

        ProjectProposal.find({},
            (error, projects) => {
                if (error) {
                    res.status(505).json(error);
                    console.log(error.message);
                } else {
                    res.status(200).json(projects);
                }
            });
    });
router.route('/titles/get/all').get(
    (req, res) => {
        let titles: TitleAPI[] = [];
        Title.find({},
            (titleError, titleResult: TitleAPI[]) => {
                if (titleError) {
                    res.status(505).json(titleError);
                    console.log(titleError.message);
                } else {
                    titles = titleResult;
                    res.status(200).json(titles);
                }
            });
    });
router.route('/notifications/get/all/:id').get(
    (req, res) => {
        const notificationType = req.params.id;
        let notificationTypesNames: NotificationTypesAPI;
        NotificationType.find({id: notificationType}, (error, types: NotificationTypesAPI) => {
            if (error) {
                res.status(505).json(error);
                console.log(error.message);
            } else {
                notificationTypesNames = types;
            }
        }).then(() => {
            Notification.find({notification_type: notificationType}, (error, notifications: NotificationAPI[]) => {
                if (error) {
                    res.status(505).json(error);
                    console.log(error.message);
                } else {
                    const notifs: NotificationAPI[] = [];
                    for (let i = 0; i < notifications.length; i++) {
                        const tempModel: NotificationAPI = new NotificationAPI();
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
    NotificationType.find({}, (error, types) => {
        if (error) {
            console.log(error);
        } else {
            res.status(200).json(types);
        }
    });
});

router.route('/notifications/types/remove').post((req, res) => {
    const typeId = req.body.data;
    NotificationType.deleteOne({id: typeId}).then(() => {
        Notification.deleteOne({
            notification_type: typeId,
        }).then(() => {
            res.status(200).json({message: 'ok'});
        });
    });
});

router.route('/notifications/remove').post((req, res) => {
    const id = req.body.data;
    Notification.deleteOne({
        id,
    }).then(() => {
        res.status(200).json({message: 'ok'});
    });

});
router.route('/notifications/types/update').post((req, res) => {
    const notification = req.body.data;
    NotificationType.updateOne({
        id: notification.id,
    }, {
        $set: {
            name: notification.name,
        },
    }, null, (err, raw) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({message: 'ok'});
        }
    });
});
router.route('/notifications/update').post((req, res) => {
    const notification = req.body.data;
    Notification.updateOne({
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
        } else {
            res.status(200).json({message: 'ok'});
        }
    });
});

router.route('/notifications/add').post((req, res) => {
    const notification = req.body.data;
    let lastIndex: number = -1;
    Notification
        .findOne({})
        .sort('-id')  // give me the max
        .exec((err, member) => {
            lastIndex = member.id;
            lastIndex++;
            const newNotificationType = new Notification(
                {
                    id: lastIndex,
                    date: notification.date,
                    description: notification.description,
                    notification_type: notification.notification_type,
                    title: notification.title,
                },
            );

            newNotificationType.save((err1, product) => {
                if (err1) {
                    console.log(err1);
                } else {
                    res.status(200).json({message: 'ok'});
                }
            });
        });
});
router.route('/notifications/types/add').post((req, res) => {
    const notificationType = req.body.data;
    let lastIndex: number = -1;
    NotificationType
        .findOne({})
        .sort('-id')  // give me the max
        .exec((err, member) => {
            lastIndex = member.id;
            lastIndex++;
            const newNotificationType = new NotificationType(
                {
                    id: lastIndex,
                    name: notificationType.name,
                },
            );

            newNotificationType.save((err1, product) => {
                if (err1) {
                    console.log(err1);
                } else {
                    res.status(200).json({message: 'ok'});
                }
            });
        });

});

router.route('/employees/get/all').get(
    (req, res) => {
        User.aggregate([
            {
                $match: {
                    type: 1.0,
                    status: 1,
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
        ], (err: Error, das: any[]) => {
            console.log(err);
            res.status(200).json(das);
        });
    });

router.route('/employees/get').post(
    (req, res) => {
        const ids = req.body.data;
        User.aggregate([
            {
                $match: {
                    id: {
                        $in: ids,
                    },
                    type: 1.0,
                    status: 1,
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
        ], (err: Error, das: any[]) => {
            console.log(err);
            res.status(200).json(das);
        });
    });

router.route('/employee/course/:id/change_section_visibility').post(
    (req, res) => {
        const courseId = req.params.id;
        const data = req.body.data;
        const visibility = data.status;
        const secition = data.section;
        console.log(courseId);
        console.log(data);
        if (secition === 'e') {
            console.log(visibility);
            Course.updateOne({
                id: courseId,
            }, {
                $set: {
                    exams_visible: visibility,
                },
            }, null, (err, raw) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json({message: 'ok'});
                }
            });
        } else if (secition === 'l') {
            Course.updateOne({
                id: courseId,
            }, {
                $set: {
                    lab_visible: visibility,
                },
            }, null, (err, raw) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json({message: 'ok'});
                }
            });
        } else {
            Course.updateOne({
                id: courseId,
            }, {
                $set: {
                    project_visible: visibility,
                },
            }, null, (err, raw) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json({message: 'ok'});
                }
            });
        }

    });

router.route('/employees/get/all/ignore_active').get(
    (req, res) => {
        User.aggregate([
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
        ], (err: Error, das: any[]) => {
            console.log(err);
            res.status(200).json(das);
        });
    });
router.route('/employees/update').post((req, res) => {
    const employee = req.body.data;
    User.findOne({
        id: employee.id,
        type: employee.type,
    }, (err: Error, doc: any) => {
        if (doc !== undefined) {
            User.updateOne({
                id: employee.id,
            }, {
                $set: {
                    name: employee.name,
                    surname: employee.surname,
                    email: employee.email,
                    status: employee.status,
                },
            }).then(() => {
                Employee.updateOne(
                    {
                        user_id: employee.id,
                    },
                    {
                        $set: {
                            address: employee.employee_data.address,
                            website: employee.employee_data.website,
                            phonenumber: employee.employee_data.phonenumber,
                            biography: employee.employee_data.biography,
                            title: employee.title.id,
                        },
                    },
                ).then(() => {
                    Course.updateMany(
                        {
                            'lectures.posted.id': employee.id,
                        }, {
                            $set: {
                                'lectures.$.posted.name': employee.name,
                                'lectures.$.posted.surname': employee.surname,
                            },
                        }, null, (e1: any, d1: any) => {
                            console.log(d1);
                        }).then(() => {
                        Course.updateMany(
                            {
                                'projects_docs.posted.id': employee.id,
                            }, {
                                $set: {
                                    'projects_docs.$.posted.name': employee.name,
                                    'projects_docs.$.posted.surname': employee.surname,
                                },
                            }, null, (e2, d2) => {
                                console.log(d2);
                            }).then(() => {
                            // @ts-ignore
                            Course.updateMany(
                                {
                                    'exams.posted.id': employee.id,
                                }, {
                                    $set: {
                                        'exams.$.posted.name': employee.name,
                                        'exams.$.posted.surname': employee.surname,
                                    },
                                }, null, (e3, d3) => {
                                    console.log(d3);
                                }).then(() => {
                                Course.updateMany(
                                    {
                                        'excercises.posted.id': employee.id,
                                    }, {
                                        $set: {
                                            'excercises.$.posted.name': employee.name,
                                            'excercises.$.posted.surname': employee.surname,
                                        },
                                    }, null, (e4, d4) => {
                                        console.log(d4);
                                    }).then(() => {
                                    Course.updateMany(
                                        {
                                            'labs_docs.posted.id': employee.id,
                                        }, {
                                            $set: {
                                                'labs_docs.$.posted.name': employee.name,
                                                'labs_docs.$.posted.surname': employee.surname,
                                            },
                                        }, null, (e5, d5) => {
                                            console.log(d5);
                                        }).then(() => {
                                        res.status(200).json({message: 'ok'});
                                    });
                                });
                            });
                        });
                    });
                });
            });
        } else {
            res.status(200).json({message: 'Korisnik ne postoji!'});
        }
    });
});

router.route('/course/student/enroll').post((req, res) => {
    const coursecode = req.body.course_id;
    const studentIndex = req.body.student_index;

    Student.findOne({
        index: studentIndex,
    }, (studentError: any, student: any) => {
        if (studentError) {
            console.log(studentError);
        } else {
            console.log(student);
            if (student) {
                const department = student.department;
                Course.findOne({
                    department,
                    coursecode,
                }, (error: any, data: any) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(data);
                        if (data) {
                            EnrolledStudents.findOneAndUpdate({
                                student_id: student.user_id,
                                course_id: coursecode,
                            }, {
                                student_id: student.user_id,
                                course_id: coursecode,
                            }, {
                                new: true,
                                upsert: true,
                            }).then(() => {
                                res.status(200).json({message: 'ok'});
                            });
                            // const newEnrollment = new EnrolledStudents({
                            //     student_id: student.user_id,
                            //     course_id: coursecode,
                            // });
                            // newEnrollment.save().then(() => {
                            //     res.status(200).json({message: 'ok'});
                            // });
                        } else {
                            res.status(200).json({message: 'Korisnik nije na odseku na kojem se odrzava ovaj kurs'});
                        }
                    }
                });
            } else {
                res.status(200).json({message: 'Student sa prilozenim indeksom ne postoji'});
            }
        }
    });

});
router.route('/course/student/remove').post((req, res) => {
    const courseId = req.body.course_id;
    const studentIndex = req.body.student_index;
    let student: StudentAPI = null;
    Student.findOne({index: studentIndex}, (err: any, stud: any) => {
        if (stud !== undefined) {
            student = new StudentAPI();
            student.id = stud.user_id;
        } else {
            res.status(505).json({message: 'Ne postoji'});
        }
    }).then(() => {
        if (student === undefined) {
            res.status(505).json({message: 'Ne postoji'});
        } else {
            EnrolledStudents.deleteOne({course_id: courseId, student_id: student.id}).then(() => {
                res.status(200).json({message: 'ok'});
                console.log('Data deleted');
            }).catch((error) => {
                res.status(505).json({message: error});
                console.log(error); // Failure
            });
        }
    });
});

router.route('/employee/profile/profilepicture/upload/:id').post(((req, res) => {
    const id = req.params.id;
    Employee.updateOne({
        user_id: id,
    }, {
        $set: {
            profilePicture: req.body.picture,
        },
    }, null, (err, raw) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({message: 'ok'});
        }
    });
}));
router.route('/employee/course/registration_lists/new').post(((req, res) => {
    const data = req.body.data;
    const courseId = data.course_id;
    CourseRegistrationList.findOne({})
        .sort('-course_id')
        .exec((err, res1: any) => {
            if (err) {
                console.log(err);
            } else {
                let lastIndex = res1.course_id;
                const newCourseRegList = new CourseRegistrationList({
                    id: ++lastIndex,
                    title: data.title,
                    exam_date: data.exam_date,
                    location: data.location,
                    course_id: data.course_id,
                    date_open: data.date_open,
                    date_close: data.date_close,
                    isActive: data.isActive,
                    enrolled: [],
                    max_num_students: data.max_num_students,
                    enrolled_number: 0,
                    uploadEnabled: data.upload_enabled,
                    student_files: [],
                });
                newCourseRegList.save((err1, product) => {
                    if (err1) {
                        console.log(err1);
                    } else {
                        res.status(200).json({message: 'ok'});
                    }
                });
            }
        });
}));

router.route('/employee/course/:id/registration_lists/get_all').get(((req, res) => {
    const data = req.body.data;
    const courseId = req.params.id;

    CourseRegistrationList.find({
            course_id: courseId,
        },
        (error, docs: any[]) => {
            if (error) {
                console.log(error);
            } else {
                res.status(200).json(docs);
            }
        });
}));

router.route('/employee/course/:id/registration_lists/delete').post(((req, res) => {
    const data = req.body.data;
    const courseId = req.params.id;
    console.log(data);
    console.log(courseId);
    CourseRegistrationList.deleteOne({
        course_id: courseId,
        id: data.id,
    }).then(() => {
        res.status(200).json({message: 'ok'});
    });
}));

router.route('/employee/course/:id/registration_lists/update').post(((req, res) => {
    const regListId = req.params.id;
    const data = req.body.data;
    console.log(regListId);
    console.log(data);
    CourseRegistrationList.updateOne({
        id: regListId,
        course_id: data.course_id,
    }, {
        $set: {
            title: data.title,
            exam_date: data.exam_date,
            location: data.location,
            date_open: data.date_open,
            date_close: data.date_close,
            isActive: data.isActive,
            upload_enabled: data.upload_enabled,
        },
    }, null, ((err, raw) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({message: 'ok'});
        }
    }));
}));

router.route('/student/course/:course_id/reg_list/:reg_id/enroll').post(((req, res) => {
    //
}));

router.route('/student/course/:course_id/reg_list/:reg_id/upload').post(((req, res) => {
    //
}));
router.route('/employees/update').post(((req, res) => {
    // TODO
    const employeeData = req.body.data;
    console.log(employeeData);
    Employee.updateOne({
        user_id: employeeData.id,
    }, {
        $set: {
            address: employeeData.employee_data.address,
            website: employeeData.employee_data.website,
            biography: employeeData.employee_data.biography,
            office: employeeData.employee_data.office,
            title: employeeData.employee_data.title,
        },
    }, null, (err, raw) => {
        if (err) {
            console.log(err);
        } else {
            User.updateOne({
                id: employeeData.id,
            }, {
                $set: {
                    name: employeeData.name,
                    surname: employeeData.surname,
                    password: employeeData.password,
                    status: employeeData.status,
                },
            }, null, ((err1, raw1) => {
                if (err1) {
                    console.log(err1);
                } else {
                    res.status(200).json({message: 'ok'});
                }
            }));
        }
    });

}));

router.route('/employee/profile/update').post(((req, res) => {
    const employeeData = req.body.data;
    console.log(employeeData);
    Employee.updateOne({
        user_id: employeeData.id,
    }, {
        $set: {
            address: employeeData.employee_data.address,
            website: employeeData.employee_data.website,
            biography: employeeData.employee_data.biography,
            office: employeeData.employee_data.office,
        },
    }, null, (err, raw) => {
        if (err) {
            console.log(err);
        } else {
            User.updateOne({
                id: employeeData.id,
            }, {
                $set: {
                    name: employeeData.name,
                    surname: employeeData.surname,
                    password: employeeData.password,
                },
            }, null, ((err1, raw1) => {
                if (err1) {
                    console.log(err1);
                } else {
                    Course.updateMany(
                        {
                            'lectures.posted.id': employeeData.employee_data.id,
                        }, {
                            $set: {
                                'lectures.$.posted.name': employeeData.employee_data.name,
                                'lectures.$.posted.surname': employeeData.employee_data.surname,
                            },
                        }, null, (e1: any, d1: any) => {
                            console.log(d1);
                        }).then(() => {
                        Course.updateMany(
                            {
                                'projects_docs.posted.id': employeeData.id,
                            }, {
                                $set: {
                                    'projects_docs.$.posted.name': employeeData.name,
                                    'projects_docs.$.posted.surname': employeeData.surname,
                                },
                            }, null, (e2, d2) => {
                                console.log(d2);
                            }).then(() => {
                            // @ts-ignore
                            Course.updateMany(
                                {
                                    'exams.posted.id': employeeData.id,
                                }, {
                                    $set: {
                                        'exams.$.posted.name': employeeData.name,
                                        'exams.$.posted.surname': employeeData.surname,
                                    },
                                }, null, (e3, d3) => {
                                    console.log(d3);
                                }).then(() => {
                                Course.updateMany(
                                    {
                                        'excercises.posted.id': employeeData.id,
                                    }, {
                                        $set: {
                                            'excercises.$.posted.name': employeeData.name,
                                            'excercises.$.posted.surname': employeeData.surname,
                                        },
                                    }, null, (e4, d4) => {
                                        console.log(d4);
                                    }).then(() => {
                                    Course.updateMany(
                                        {
                                            'labs_docs.posted.id': employeeData.id,
                                        }, {
                                            $set: {
                                                'labs_docs.$.posted.name': employeeData.name,
                                                'labs_docs.$.posted.surname': employeeData.surname,
                                            },
                                        }, null, (e5, d5) => {
                                            console.log(d5);
                                        }).then(() => {
                                        res.status(200).json({message: 'ok'});
                                    });
                                });
                            });
                        });
                    });
                }
            }));
        }
    });
}));

router.route('/employee/course/:id/update').post(((req, res) => {
    const courseId = req.params.id;
    const courseData = req.body.data;
    Course.findOne({
        id: courseId,
    }, (err: Error, doc: any) => {

        const oldcoursecode = doc.coursecode;

        Course.updateOne(
            {
                id: courseId,
            }, {
                name: courseData.name,
                coursecode: courseData.coursecode,
                acronym: courseData.acronym,
                semester: courseData.semester,
                type: courseData.type,
                department: courseData.department,
                courseDetails: courseData.courseDetails,
            }, null, (error: Error, course: any) => {
                if (error) {
                    console.log(error);
                } else {
                    if (courseData.isMapped) {
                        Course.updateMany(
                            {
                                mapHash: courseData.mapHash,
                            }, {
                                // courseDetails: courseData.courseDetails, Ne mapiramo detalje, mapiramo sve ostalo
                                notifications: courseData.notifications,
                                exams: courseData.exams,
                                excercises: courseData.excercises,
                                labs_docs: courseData.labs_docs,
                                labs_texts: courseData.labs_texts,
                                lectures: courseData.lectures,
                                projects_docs: courseData.projects_docs,
                                projects_texts: courseData.projects_texts,
                            },
                        );
                    }
                    EnrolledStudents.updateMany({
                        course_id: oldcoursecode,
                    }, {
                        $set: {
                            course_id: courseData.coursecode,
                        },
                    }, null, (err1, raw) => {
                        Employee.find(
                            {
                                'courses.coursecode': oldcoursecode,
                            }
                            , (agg_err: Error, result: any[]) => {
                                if (agg_err) {
                                    console.log(agg_err);
                                } else {
                                    const ids = [];
                                    for (const resultElement of result) {
                                        ids.push(resultElement.user_id);
                                    }
                                    Employee.updateMany({
                                        user_id: {
                                            $in: ids,
                                        },
                                        courses: {
                                            $elemMatch: {
                                                coursecode: oldcoursecode,
                                            },
                                        },
                                    }, {
                                        $set: {
                                            'courses.$.coursecode': courseData.coursecode,
                                        },
                                    }, null, ((err2, raw1) => {
                                        if (err2) {
                                            console.log(err2);
                                        } else {
                                            res.status(200).json({message: 'ok'});
                                        }
                                    }));
                                }
                            });
                    });

                }
            });
    });
}));

router.route('/employee/course/:id/lectures/update').post((req, res) => {
    const courseId = req.params.id;
    const data = req.body.data;

    Course.findOne({
        id: courseId,
    }, (error: any, raw: any) => {
        const courseData = raw;
        if (error) {
            console.log(error);
        } else {
            if (courseData) {
                Course.updateMany({
                    mapHash: courseData.mapHash,
                }, {
                    $push: {
                        lectures: data,
                    },
                }, null, (fatal, doc: any) => {
                    if (fatal) {
                        console.log(fatal);
                    } else {
                        console.log(doc);
                        res.status(200).json({message: 'ok'});
                    }
                });
            }
        }
    });

});

router.route('/employee/course/:id/excercises/update').post((req, res) => {
    const courseId = req.params.id;
    const data = req.body.data;

    Course.findOne({
        id: courseId,
    }, (error: any, raw: any) => {
        const courseData = raw;
        if (error) {
            console.log(error);
        } else {
            if (courseData) {
                Course.updateMany({
                    mapHash: courseData.mapHash,
                }, {
                    $push: {
                        excercises: data,
                    },
                }, null, (fatal, doc: any) => {
                    if (fatal) {
                        console.log(fatal);
                    } else {
                        console.log(doc);
                        res.status(200).json({message: 'ok'});
                    }
                });
            }
        }
    });

});

router.route('/employee/course/:id/exams/update').post((req, res) => {
    const courseId = req.params.id;
    const data = req.body.data;

    Course.findOne({
        id: courseId,
    }, (error: any, raw: any) => {
        const courseData = raw;
        if (error) {
            console.log(error);
        } else {
            if (courseData) {
                Course.updateMany({
                    mapHash: courseData.mapHash,
                }, {
                    $push: {
                        exams: data,
                    },
                }, null, (fatal, doc: any) => {
                    if (fatal) {
                        console.log(fatal);
                    } else {
                        console.log(doc);
                        res.status(200).json({message: 'ok'});
                    }
                });
            }
        }
    });

});

router.route('/employee/course/:id/labs/notification/create').post((req, res) => {
    const courseId = req.params.id;
    const data = req.body.data;

    Course.findOne({
        id: courseId,
    }, (error: any, raw: any) => {
        const courseData = raw;
        if (error) {
            console.log(error);
        } else {
            if (courseData) {
                Course.updateMany({
                    mapHash: courseData.mapHash,
                }, {
                    $push: {
                        labs_texts: data,
                    },
                }, null, (fatal, doc: any) => {
                    if (fatal) {
                        console.log(fatal);
                    } else {
                        console.log(doc);
                        res.status(200).json({message: 'ok'});
                    }
                });
            }
        }
    });

});
router.route('/employee/course/:id/projects/notification/create').post((req, res) => {
    const courseId = req.params.id;
    const data = req.body.data;

    Course.findOne({
        id: courseId,
    }, (error: any, raw: any) => {
        const courseData = raw;
        if (error) {
            console.log(error);
        } else {
            if (courseData) {
                Course.updateMany({
                    mapHash: courseData.mapHash,
                }, {
                    $push: {
                        projects_texts: data,
                    },
                }, null, (fatal, doc: any) => {
                    if (fatal) {
                        console.log(fatal);
                    } else {
                        console.log(doc);
                        res.status(200).json({message: 'ok'});
                    }
                });
            }
        }
    });

});

router.route('/employee/course/:id/projects/files/create').post((req, res) => {
    const courseId = req.params.id;
    const data = req.body.data;

    Course.findOne({
        id: courseId,
    }, (error: any, raw: any) => {
        const courseData = raw;
        if (error) {
            console.log(error);
        } else {
            if (courseData) {
                Course.updateMany({
                    mapHash: courseData.mapHash,
                }, {
                    $push: {
                        projects_docs: data,
                    },
                }, null, (fatal, doc: any) => {
                    if (fatal) {
                        console.log(fatal);
                    } else {
                        console.log(doc);
                        res.status(200).json({message: 'ok'});
                    }
                });
            }
        }
    });

});
router.route('/employee/course/:id/labs/files/create').post((req, res) => {
    const courseId = req.params.id;
    const data = req.body.data;

    Course.findOne({
        id: courseId,
    }, (error: any, raw: any) => {
        const courseData = raw;
        if (error) {
            console.log(error);
        } else {
            if (courseData) {
                Course.updateMany({
                    mapHash: courseData.mapHash,
                }, {
                    $push: {
                        labs_docs: data,
                    },
                }, null, (fatal, doc: any) => {
                    if (fatal) {
                        console.log(fatal);
                    } else {
                        console.log(doc);
                        res.status(200).json({message: 'ok'});
                    }
                });
            }
        }
    });

});

router.route('/course/create').post((req, res) => {
    let lastIndex: number = -1;
    Course
        .findOne({})
        .sort('-id')  // give me the max
        .exec((err, member) => {
            lastIndex = member.id;

            const coursesToInsert = req.body.data;
            const coursenames: string[] = [];
            lastIndex++;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < coursesToInsert.length; i++) {
                coursesToInsert[i].mapHash = lastIndex;
                coursenames.push(coursesToInsert[i].coursecode);
            }
            Course.find({coursecode: {$in: coursenames}}).then(async (founds) => {
                if (founds.length === 0) {
                    for (let i = 0; i < coursesToInsert.length; i++) {
                        coursesToInsert[i].id = lastIndex++;
                        const newCourse = new Course(coursesToInsert[i]);
                        await newCourse.save();
                    }
                    res.status(200).json({message: 'ok'});

                } else {
                    res.status(200).json({message: 'Kurs sa definisanim imenom postoji!'});
                }
            });
        });
});

router.route('/course/update').post((req, res) => {
    const courseData = req.body.data;
    const courseId = courseData.id;
    Course.findOne({
        id: courseId,
    }, (err: Error, doc: any) => {

        const oldcoursecode = doc.coursecode;

        Course.updateOne(
            {
                id: courseId,
            }, {
                name: courseData.name,
                coursecode: courseData.coursecode,
                acronym: courseData.acronym,
                semester: courseData.semester,
                type: courseData.type,
                department: courseData.department,
                courseDetails: courseData.courseDetails,
            }, null, (error: Error, course: any) => {
                if (error) {
                    console.log(error);
                } else {
                    if (courseData.isMapped) {
                        Course.updateMany(
                            {
                                mapHash: courseData.mapHash,
                            }, {
                                courseDetails: courseData.courseDetails,
                                notifications: courseData.notifications,
                                exams: courseData.exams,
                                excercises: courseData.excercises,
                                labs_docs: courseData.labs_docs,
                                labs_texts: courseData.labs_texts,
                                lectures: courseData.lectures,
                                projects_docs: courseData.projects_docs,
                                projects_texts: courseData.projects_texts,
                            },
                        );
                    }
                    EnrolledStudents.updateMany({
                        course_id: oldcoursecode,
                    }, {
                        $set: {
                            course_id: courseData.coursecode,
                        },
                    }, null, (err1, raw) => {
                        Employee.find(
                            {
                                'courses.coursecode': oldcoursecode,
                            }
                            , (agg_err: Error, result: any[]) => {
                                if (agg_err) {
                                    console.log(agg_err);
                                } else {
                                    const ids = [];
                                    for (const resultElement of result) {
                                        ids.push(resultElement.user_id);
                                    }
                                    Employee.updateMany({
                                        user_id: {
                                            $in: ids,
                                        },
                                        courses: {
                                            $elemMatch: {
                                                coursecode: oldcoursecode,
                                            },
                                        },
                                    }, {
                                        $set: {
                                            'courses.$.coursecode': courseData.coursecode,
                                        },
                                    }, null, ((err2, raw1) => {
                                        if (err2) {
                                            console.log(err2);
                                        } else {
                                            res.status(200).json({message: 'ok'});
                                        }
                                    }));
                                }
                            });
                    });

                }
            });
    });
});

router.route('/course/:id/get_details').get((req, res) => {
    const courseId = req.params.id;
    Course.findOne({
        id: courseId,
    }, (error: Error, document: any) => {
        if (error) {
            console.log(error);
        } else {
            if (document !== null) {
                res.status(200).json(document);
            } else {
                res.status(200).json({message: 'Predmet ne postoji!'});
            }
        }
    });
});

router.route('/course/engagement/update').post((req, res) => {
    const courseId = req.body.course_id;
    const engagement = req.body.engagement;
    console.log(engagement);
    Course.findOne({
        coursecode: courseId,
    }, (error: Error, course: CourseAPI) => {
        if (error) {
            res.status(505).json({message: error});
            console.log(error); // Failure
        } else {
            if (course !== undefined) {
                Course.updateOne(
                    {coursecode: courseId}, {
                        $set: {
                            engagement,
                        },
                    },
                ).then(() => {
                    const lecturersSet = new Set();
                    for (let i = 0; i < engagement.length; i++) {
                        lecturersSet.add(Number(engagement[i].lectureLecturer));
                        lecturersSet.add(Number(engagement[i].auditoryExcercisesLecturer));
                    }
                    Employee.find({}, async (errorEmployee, employees: EmployeeAPI[]) => {
                        for (let i = 0; i < employees.length; i++) {
                            const employeeCourses = employees[i].courses;
                            const kurcina = [];
                            for (let j = 0; j < employeeCourses.length; j++) {
                                if (String(employeeCourses[j].coursecode) != String(courseId)) {
                                    kurcina.push({coursecode: employeeCourses[j].coursecode});
                                }
                            }

                            if (lecturersSet.has(Number(employees[i].user_id))) {
                                console.log(employees[i].user_id);
                                kurcina.push({coursecode: courseId});
                            }

                            await Employee.updateOne({user_id: employees[i].user_id}, {
                                $set: {
                                    courses: kurcina,
                                },
                            }).then(() => {
                                console.log(employeeCourses);
                            });
                        }
                        res.status(200).json({message: 'ok'});
                    });
                });
            } else {
                res.status(505).json({message: 'Greska'});
                console.log(error); // Failure
            }
        }
    });
});
router.route('/course/:id/get/engagement').get((req, res) => {
    const courseId = req.params.id;
    Course.findOne({
        coursecode: courseId,
    }, (error: Error, course: CourseAPI) => {
        if (error) {
            res.status(505).json({message: error});
            console.log(error); // Failure
        } else {
            if (course !== null && course !== undefined) {
                res.status(200).json(course.engagement);
            } else {
                res.status(200).json([]);
            }
        }
    });
});

router.route('/students/create/new').post(
    (req, res) => {
        const userData: UserRegistrationDataAPI = req.body.data;
        let lastIndex: number = -1;
        User
            .findOne({})
            .sort('-id')  // give me the max
            .exec((err, member) => {
                lastIndex = member.id;

                User.find({username: userData.username}, (error, document) => {
                    if (document.length !== 0) {
                        res.status(200).json({message: 'Korisnik vec postoji!'});
                    } else {
                        lastIndex++;
                        const newUser = new User({
                            id: lastIndex,
                            username: userData.username,
                            password: userData.password,
                            name: userData.name,
                            surname: userData.surname,
                            email: userData.username,
                            status: userData.active,
                            type: 2,
                        });
                        const newStudent = new Student({
                            user_id: lastIndex,
                            index: userData.index,
                            academic_level: userData.type,
                            verify: userData.verifyPassword,
                        });

                        newUser.save().then(() => newStudent.save().then(() => {
                            res.status(200).json({message: 'ok'});
                        }));
                    }
                });

            });

    });
router.route('/employees/create/new').post(
    (req, res) => {
        const userData: EmployeeRegistrationAPI = req.body.data;
        let lastIndex: number = -1;
        User
            .findOne({})
            .sort('-id')  // give me the max
            .exec((err, member) => {
                lastIndex = member.id;

                User.find({username: userData.username}, (error, document) => {
                    if (document.length !== 0) {
                        res.status(200).json({message: 'Korisnik vec postoji!'});
                    } else {
                        lastIndex++;
                        const newUser = new User({
                            id: lastIndex,
                            username: userData.username,
                            password: userData.password,
                            name: userData.name,
                            surname: userData.surname,
                            email: userData.email,
                            status: userData.active,
                            type: 1,
                        });
                        const newEmployee = new Employee({
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
                            res.status(200).json({message: 'ok'});
                        }));
                    }
                });

            });

    });

router.route('/courses/semester/:semester/:dept').get(
    (req, res) => {
        const semester = Number(req.params.semester);
        const dept = Number(req.params.dept);
        console.log(semester);
        console.log(dept);
        Course.aggregate([
            {
                $match: {
                    semester,
                    department: dept,
                },
            },
            {
                $lookup: {
                    from: 'enrolled_students',
                    localField: 'coursecode',
                    foreignField: 'course_id',
                    as: 'enrolled_students',
                },
            },
        ], (error: any, docs: any[]) => {
            if (error) {
                console.log(error);
            } else {
                console.log(docs);
                res.status(200).json(docs);
            }
        });

    });

router.route('/student/enroll/courses').post(
    (req, res) => {
        const student = req.body.student;
        const courses = req.body.coursesAndStatuses;
        console.log(req.body);
        EnrolledStudents.remove({
            student_id: student.id,
        }, async (error) => {
            if (error) {
                console.log(error);
            } else {
                for (const course of courses) {
                    const newEnroll = new EnrolledStudents({
                        student_id: student.id,
                        course_id: course.course_id,
                    });
                    await newEnroll.save();
                }
                res.status(200).json({message: 'ok'});
            }
        });
    });

router.route('/student/:id/courses').get(
    (req, res) => {
        const student_id = req.params.id;

        console.log(req.body);
        EnrolledStudents.aggregate(
            [
                {
                    $match: {
                        student_id: Number(student_id),
                    },
                },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'course_id',
                        foreignField: 'coursecode',
                        as: 'courses',
                    },
                },
            ], (error: any, data: any) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(data);
                    res.status(200).json(data);
                }
            });
    });
router.route('/student/courses/registrations').post(
    (req, res) => {
        const course_ids = req.body.course_ids;
        console.log(req.body);
        CourseRegistrationList.find({
            course_id: {$in: course_ids},
            date_open: {$lte: new Date()},
            date_close: {$gte: new Date()},
            isActive: true,
        }, (error: any, docs: any) => {
            if (error) {
                console.log(error);
            } else {
                console.log(docs);
                res.status(200).json(docs);
            }
        });
    });

router.route('/student/registration/create').post(
    (req, res) => {
        const student = req.body.student;
        const course = req.body.course;
        console.log(req.body);

        CourseRegistrationList.updateOne({
            id: course.id,
        }, {
            $inc: {
                enrolled_number: 1,
            },
            $push: {
                enrolled: student.id,
            },
        }, null, (error2: any, raw: any) => {
            if (error2) {
                console.log(error2);
            } else {
                console.log(raw);
                res.status(200).json({message: 'ok'});
            }
        });

    });
router.route('/student/remove/from/registration').post(
    (req, res) => {
        const student = req.body.student;
        const course = req.body.course;
        console.log(req.body);

        CourseRegistrationList.updateOne({
            id: course.id,
        }, {
            $inc: {
                enrolled_number: -1,
            },
            $pull: {
                enrolled: student.id,
            },
        }, null, (error2: any, raw: any) => {
            if (error2) {
                console.log(error2);
            } else {
                console.log(raw);
                res.status(200).json({message: 'ok'});
            }
        });

    });

router.route('/student/registration/update/file_upload').post(
    (req, res) => {
        const fileData = req.body.file;
        const regEvent = req.body.registrationEvent;
        console.log(req.body);

        CourseRegistrationList.updateOne({
            'id': regEvent.id,
            'student_files.uploader.id': fileData.uploader.id,
        }, {
            $pull: {
                student_files: {
                    'uploader.id': fileData.uploader.id,
                },
            },
        }, null, (error: any, doc: any) => {
            if (error) {
                console.log(error);
            } else {
                console.log(doc);
                CourseRegistrationList.updateOne({
                    id: regEvent.id,
                }, {
                    $push: {
                        student_files: fileData,
                    },
                }, null, (err2, doc2) => {
                    console.log(doc2);
                    res.status(200).json({message: 'ok'});
                });
            }

        });

    });

router.route('/student/verify').post(
    (req, res) => {
        const newPassword = req.body.password;
        const user = req.body.user;

        console.log(req.body);

        User.updateOne({
            id: user.id,
        }, {
            $set: {
                password: newPassword,
            },
        }, null, (error, doc) => {
            if (error) {
                console.log(error);
            } else {
                console.log(doc);
                Student.updateOne({
                    user_id: user.id,
                }, {
                    $set: {
                        verify: false,
                    },
                }, null, (err2, doc2) => {
                    if (err2) {
                        console.log(err2);
                    } else {
                        console.log(doc2);
                        res.status(200).json({message: 'ok'});
                    }
                });
            }
        });

    });

app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
