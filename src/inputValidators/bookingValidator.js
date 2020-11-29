import Joi from "joi";
import config from "config";
 // schema options
const options = config.get("joiValidationOptions");

 // define base schema rules
 const bookingRequestSchemaRules = {
    bookingDate: Joi.date().default(new Date()),
    bookedHours: Joi.number().default(9),
    userId: Joi.string().required(),
};

const BookingRequestSchema = Joi.object(bookingRequestSchemaRules);

export const validateBooking = (req) => BookingRequestSchema.validate(req.body, options);
