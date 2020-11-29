import { ParkingSchema } from '../src/models/parkingSlotModel.js';
import mongoose from 'mongoose';
import moment from "moment";
import config from "config";

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(config.get("mongoConnectionString"), {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Parking = mongoose.model('Parking', ParkingSchema);

const removeExpiredBookings = (req, res) => {
    Parking.updateMany( 
    { 'bookings.expiresOn': { $lt: new Date() } }, 
    { $set: { bookings: [] } }, 
    { useFindAndModify: false, multi: true } , 
    (err, parking) => {
             if (err) {
                 console.log(err);
             }
             console.log(parking);
         }
    );
};

removeExpiredBookings();