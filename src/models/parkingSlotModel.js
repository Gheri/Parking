import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const Schema = mongoose.Schema;

export const BookingSchema = new Schema({
    _id: {
        type: String,
        default: nanoid()
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    bookedHours: {
        type: Number,
        default: 9
    },
    userId: {
        type: String,
        required: 'Enter a user id'
    },
    status: {
        type: String,
        default: "initiated"
    },
    expiresOn: {
        type: Date,
        required: 'Enter expiration of booking'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
    modifiedBy: {
        type: String
    }
})

export const ParkingSchema = new Schema({
    name: {
        type: String,
        required: 'Enter a parking name'
    },
    reserved: {
        type: Boolean,
        default: false
    },
    bookings: {
        type: Array,
        default:[]
    },
    dimensions: {
        type: Object,
    },
    createdAt: {
        type: Date,
    },
    createdBy: {
        type: String,
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
    modifiedBy: {
        type: String
    }
});
