import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    firstName: {
        type: String,
        required: 'Enter a first name'
    },
    lastName: {
        type: String,
        required: 'Enter a last name'
    },
    employeeId: {
        type: String,
        required: 'Enter Id provided by Company'
    },
    email: {
        type: String,
        required: 'Enter corporate email id'
    },
    company: {
        type: String,
        required: 'Enter company name'
    },
    phone: {
        type: Number,
        required: 'Enter contact number'
    },
    gender: {
        type: String,
        default: ""
    },
    differentlyAbled: {
        type: Boolean,
        default: false
    },
    pregnant: {
        type: Boolean,
        default: false,
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
