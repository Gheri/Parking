import Joi from "joi";
import config from "config";
 // schema options
const options = config.get("joiValidationOptions");

 // define base schema rules
 const parkingRequestSchemaRules = {
    name: Joi.string().required(),
    reserved: Joi.boolean().default(false),
};

const ParkingRequestSchema = Joi.object(parkingRequestSchemaRules);

export const validateParking = (req) => ParkingRequestSchema.validate(req.body, options);

