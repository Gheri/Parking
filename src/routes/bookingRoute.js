import { addNewBooking, confirmBooking, cancelBooking } from "../controllers/bookingController.js"

const routes = (app) => {
    app.route('/bookings')
        .post(addNewBooking);

    app.route('/bookings/:bookingId/cancel')
         .post(cancelBooking);

    app.route('/bookings/:bookingId/confirm')
         .post(confirmBooking);
}

export default routes;