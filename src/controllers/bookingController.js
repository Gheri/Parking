import mongoose from 'mongoose';
import { validateBooking } from '../inputValidators/bookingValidator.js';
import { BookingSchema, ParkingSchema} from '../models/parkingSlotModel.js';
import HTTP_STATUS from "http-status";
import { UserSchema } from '../models/userModel.js';
import moment from 'moment';
import { nanoid } from 'nanoid';
import config from "config";

const Parking = mongoose.model('Parking', ParkingSchema);
const User = mongoose.model('User', UserSchema);
const Booking = mongoose.model('Booking', BookingSchema);

export const addNewBooking = async (req, res) => {
    // input validation
    // TODO move to validation middleware
    const { error, value } = validateBooking(req.body);
    if(error) {
        res.status(HTTP_STATUS.BAD_REQUEST).send(error);
        return;
    }

    // TODO optimize one database call for update and user check
    //  validate if given user is present 
    let userDocument = await User.findById(req.body.userId,{__v: 0}).exec();;
    
    if(!userDocument) {
        res.status(HTTP_STATUS.NOT_FOUND).send({"message": "User Not Found"});
    }

    const isPregnantOrDifferentlyAbled = userDocument.pregnant | userDocument.differentlyAbled;
    const  vacantUnReservedParkings = await Parking.find({reserved: false,bookings: { $exists: true, $size: 0 } }).count().exec();
    const vacantReservedParkings = await Parking.find({reserved: true,bookings: { $exists: true, $size: 0 } }).count().exec();
    const totalVacantParkings = vacantReservedParkings + vacantUnReservedParkings;
    if(!isPregnantOrDifferentlyAbled && vacantUnReservedParkings === 0) { 
        res.status(HTTP_STATUS.NOT_FOUND).send({message: "Parkings is full."});
        return; 
    }
    
    if(totalVacantParkings === 0) {
          res.status(HTTP_STATUS.NOT_FOUND).send({message: "Parkings is full."});
          return;
    }

    // calculates expiresOn if capacity is less than 50 %
    let expiresOn = moment().utc().add(moment.duration(config.get("maxWaitingTimeInMins"), "minutes")).toDate();
    if( totalVacantParkings < (config.get("totalParkings") / 2)) {
        expiresOn = moment().utc().add(moment.duration(config.get("minWaitingTimeInMins"), "minutes")).toDate();
    }

    // TODO take JWT Claim to set author for new document
    const bookingToBeAdded = {...req.body, _id: nanoid(), expiresOn: expiresOn ,createdAt: new Date(), createdBy: "Admin", modifiedBy: "Admin"};
    const bookingDocument = new Booking(bookingToBeAdded);

    // preference to reserved for pregnant or differently enabled people
    let reserved = false;
    if(isPregnantOrDifferentlyAbled && vacantReservedParkings > 0) {
       reserved = true;
    }

    Parking.findOneAndUpdate({reserved, bookings: { $exists: true, $size: 0 }}, 
        { $push: { bookings: bookingDocument } }, 
        { new: true, useFindAndModify: false },
        (err, parking) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(parking);
    });
};


export const cancelBooking = (req, res) => {
    // TODO implementation
    //TODO validate id is of ObjectIdType
    const newExpiry = moment.utc().add(moment.duration(2, "minutes")).toDate();
    Parking.updateOne( 
    { bookings: { $elemMatch: { _id: req.params.bookingId }} }, 
    { $set: { "bookings.$.expiresOn" : newExpiry, "bookings.$.status": "cancelled" } }, 
    { useFindAndModify: false } , 
    (err, parking) => {
             if (err) {
                 res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
             }
             res.sendStatus(HTTP_STATUS.NO_CONTENT);
         }
    );
};

export const confirmBooking = (req, res) => {
    // TODO implementation
    //TODO validate id is of ObjectIdType
    const newExpiry = moment.utc().add(moment.duration(config.get("bookingHours"), "hours")).toDate();
    Parking.updateOne( 
    { bookings: { $elemMatch: { _id: req.params.bookingId, status: "initiated" }} }, 
    { $set: { "bookings.$.expiresOn" : newExpiry, "bookings.$.status": "booked" } }, 
    { useFindAndModify: false } , 
    (err, parking) => {
             if (err) {
                 res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
             }
             res.send(HTTP_STATUS.OK).send({message: "Bkkoins is confirmed"});
         }
    );
};
