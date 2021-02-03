import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
import UserModel from './models/User.model';

const app = express();

app.use(cors());
app.use(bodyParser());

mongoose.connect('mongodb://localhost:27017/PIAdb');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB Connection open!');
});

const router = express.Router();

router.route('/login').post(
    (request: Request, response: Response) => {
        console.log('Login request accepted!');

        let username = request.body.username
        let password = request.body.password

        UserModel.findOne(
            {
                username: username,
                password: password,
            },
            (error: Error, user: any) => {
                if (error) {
                    response.status(505).json(error);
                    console.log(error.message);
                } else {
                    response.status(200).json(user);
                }
            }
        )

    }
);

router.route('/register').post(
    (request: Request, response: Response) => {
        console.log('Register request accepted!');

        let user = new UserModel(request.body);
        UserModel.findOne(
            { 'username': request.body.username },
            (error: Error, userFound: any) => {
                if (error) {
                    response.status(505).json(error);
                    console.log(error.message);
                } else {
                    if (userFound) {
                        response.status(505).json({ 'isSuccessful': 0 });
                    } else {
                        user.save().then(
                            (doc: any) => {
                                if (user) {
                                    response.status(200).json({ 'isSuccessful': 1 });
                                } else {
                                    response.status(505).json({ 'isSuccessful': 0 });
                                }
                            });
                    }


                }
            }
        );
    }
)

app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));