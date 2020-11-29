import mongoose from 'mongoose';
import { UserSchema } from '../models/userModel.js';
import { validateUser } from '../inputValidators/userValidator.js';
import HTTP_STATUS from "http-status";

const User = mongoose.model('User', UserSchema);

export const addNewUser = (req, res) => {
    // input validation
    // TODO move to validation middleware
    const { error, value } = validateUser(req.body);
    if(error) {
        res.status(HTTP_STATUS.BAD_REQUEST).send(error);
        return;
    }

    // TODO take JWT Claim to set author for new document
    const userToBeAdded = {...req.body,createdAt: new Date(), createdBy: "Admin", modifiedBy: "Admin"};
    // adding new User
    let newUser = new User(userToBeAdded);
    newUser.save((err, user) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(user);
    });
};

export const getUsers = (req, res) => {
    User.find({},{ __v: 0}, (err, users) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(users);
    });
};

export const getUserWithId = (req, res) => {
    //TODO validate id is of ObjectIdType

    User.findById(req.params.userId, {__v: 0}, (err, user) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(user);
    });
};

export const updateUser = (req, res) => {
    //TODO validate id is of ObjectIdType

    // input validation
    // TODO move to validation middleware
    const { error, value } = validateUser(req.body);
    if(error) {
        res.status(HTTP_STATUS.BAD_REQUEST).send(error);
        return;
    }

    // TODO take JWT Claim to set author for new document
    const userToBeUpdated = {...req.body, modifiedAt: new Date(), modifiedBy: "Admin"};

    // update user
    User.findOneAndUpdate({ _id: req.params.userId}, userToBeUpdated, { new: true, useFindAndModify: false }, (err, user) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
            return;
        }
        res.json(user);
    });
};

export const deleteUser = (req, res) => {
    //TODO validate id is of ObjectIdType

    User.findOneAndRemove({ _id: req.params.userId}, (err, user) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
            return;
        }
        res.sendStatus(HTTP_STATUS.NO_CONTENT);
    });
};
