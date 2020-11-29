import mongoose from 'mongoose';
import { validateParking } from '../inputValidators/parkingValidator.js';
import { ParkingSchema } from '../models/parkingSlotModel.js';
import HTTP_STATUS from "http-status";

const Parking = mongoose.model('Parking', ParkingSchema);

export const addNewParking = (req, res) => {
    // input validation
    // TODO move to validation middleware
    const { error, value } = validateParking(req.body);
    if(error) {
        res.status(HTTP_STATUS.BAD_REQUEST).send(error);
        return;
    }

    // TODO take JWT Claim to set author for new document
    const parkingToBeAdded = {...req.body,createdAt: new Date(), createdBy: "Admin", modifiedBy: "Admin"};
    let newParking = new Parking(parkingToBeAdded);
    console.log(newParking);
    newParking.save((err, parking) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
            return;
        }
        res.json(parking);
    });
};

export const getParkings = (req, res) => {
    let query = {}
    if(req.query.occupied === "true") {
        query = { bookings: { $exists: true, $size: 1 } };
    } else if(req.query.occupied === "false") {
        query = { bookings: { $exists: true, $size: 0 } }
    } 
    Parking.find(query,{ __v: 0}, (err, parkings) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(parkings);
    });
};

export const getParkingWithId = (req, res) => {
    Parking.findById(req.params.parkingId,{__v: 0}, (err, parking) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(parking);
    });
};

export const updateParking = (req, res) => {
    //TODO validate id is of ObjectIdType

    // input validation
    // TODO move to validation middleware
    const { error, value } = validateParking(req.body);
    if(error) {
        res.status(HTTP_STATUS.BAD_REQUEST).send(error);
        return;
    }

    // TODO take JWT Claim to set author for new document
    const parkingToBeUpdated = {...req.body, modifiedAt: new Date(), modifiedBy: "Admin"};

    Parking.findOneAndUpdate({ _id: req.params.parkingId}, parkingToBeUpdated, { new: true, useFindAndModify: false }, (err, parking) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(parking);
    });
};

export const deleteParking = (req, res) => {
    //TODO validate id is of ObjectIdType

    Parking.findOneAndRemove({ _id: req.params.parkingId}, (err, parking) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.sendStatus(HTTP_STATUS.NO_CONTENT);
    });
};
