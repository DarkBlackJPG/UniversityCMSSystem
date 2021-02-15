import bodyParser from 'body-parser';
import cors from 'cors';
import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import {CourseAPI} from './API/CourseAPI';
import {EmployeeAPI} from './API/Employee.API';
import {EnrollmentAPI} from './API/Enrollment.API';
import {NewCourseData} from './API/NewCourseData.API';
import {NotificationAPI} from './API/Notification.API';
import {NotificationTypesAPI} from './API/NotificationTypes.API';
import {StudentAPI} from './API/Student.API';
import {TitleAPI} from './API/TitleAPI';
import {UsersAPI} from './API/Users.API';
import CourseModel from './models/Course.model';
import Course from './models/Course.model';
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

router.route('/course/:id/get/enrolled/all').get(
    (req, res) => {
        const courseId = req.params.id;
        const preparedStudents: StudentAPI[] = [];

        EnrolledStudents.aggregate([
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
        ], (error: Error, users: any[]) => {
            if (error) {
                res.status(505).json(error);
                console.log(error.message);
            } else {
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
                                    let myTitle: TitleAPI;
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
    const newData = new EnrollmentAPI();
    let student: StudentAPI = null;
    Student.findOne({index: studentIndex}, (err: any, stud: EnrollmentAPI) => {
        if (stud !== undefined) {
            student = new StudentAPI();
            student.id = stud.user_id;
        } else {
            res.status(505).json({message: 'Ne postoji'});
        }

    }).then(() => {
        if (student != null) {
            newData.user_id = student.id;
            newData.course_id = courseId;
            const newStudent = new EnrolledStudents(newData);
            newStudent.save((err, newStudent) => {
                if (err) {
                    console.log(err);
                    res.status(505).json({message: 'Greska'});
                } else {
                    res.status(200).json({message: 'ok'});
                    console.log(newStudent);
                }
            });
        } else {
            res.status(505).json({message: 'Greska'});
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
            EnrolledStudents.deleteOne({course_id: courseId, user_id: student.id}).then(() => {
                res.status(200).json({message: 'ok'});
                console.log('Data deleted');
            }).catch((error) => {
                res.status(505).json({message: error});
                console.log(error); // Failure
            });
        }
    });
});

router.route('/course/create').post((req, res) => {
    const courseData: NewCourseData = req.body.data;
    if (courseData.isMapped) {
        Course.find({
            coursecode: {
                $in: [
                    courseData.coursecode_SI,
                    courseData.coursecode_RTI,
                ],
            },
        }, (error, response) => {
            if (response.length === 0) {
                const newCourse = new Course({
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
                newCourse.save().then((doc: any) => {
                    if (newCourse) {
                        const newCourseRTI = new Course({
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
                        newCourseRTI.save().then((resp: any) => {
                            if (newCourseRTI) {
                                res.status(200).json({message: 'ok'});
                            } else {
                                res.status(505).json({message: 'Nesto nije dobrt'});
                            }
                        });
                    } else {
                        res.status(505).json({message: 'Nesto nije dobrt'});
                    }
                });
            } else {
                res.status(505)
                    .json({message: 'Kurs sa ovom sifrom vec postoji (sifra je ista ili za RTI smer ili za SI smer)'});
                console.log(error); // Failure
            }
        });
    } else {
        let courseCode = '';
        let dept = -1;
        if (courseData.isSI) {
            dept = 1;
            courseCode = courseData.coursecode_SI;
        } else {
            dept = 0;
            courseCode = courseData.coursecode_RTI;
        }
        Course.find({
            coursecode: {
                $in: [
                    courseCode,
                ],
            },
        }, (error, response) => {
            if (response.length === 0) {
                const newCourse = new Course({
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
                newCourse.save().then((doc: any) => {
                    if (newCourse) {
                        res.status(200).json({message: 'ok'});
                    } else {
                        res.status(505).json({message: 'Nesto nije dobrt'});
                    }
                });
            } else {
                res.status(505)
                    .json({message: 'Kurs sa ovom sifrom vec postoji'});
                console.log(error); // Failure
            }
        });
    }
});
router.route('/course/engagement/update').post((req, res) => {
    const courseId = req.body.course_id;
    const engagement = req.body.engagement;
    Course.findOne({
        coursecode: courseId,
    }, (error: Error, course: CourseAPI) => {
        if (error) {
            res.status(505).json({message: error});
            console.log(error); // Failure
        } else {
            if (course !== undefined) {
                Course.collection.updateOne(
                    {coursecode: courseId}, {
                        $push: {
                            engagement,
                        },
                    },
                );
                res.status(200).json({message: 'ok'});
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
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
