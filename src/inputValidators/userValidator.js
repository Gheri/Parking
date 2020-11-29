import Joi from "joi";
import config from "config";
const options = config.get("joiValidationOptions");


 // define base schema rules
 const userRequestSchemaRules = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    employeeId: Joi.string().required(),
    email: Joi.string().email().required(),
    company: Joi.string().required(),
    phone: Joi.number().required(),
    gender: Joi.string().empty('').default(''),
    differentlyAbled: Joi.boolean().default(false),
    pregnant: Joi.boolean().default(false)
};

const UserRequestSchema = Joi.object(userRequestSchemaRules);

export const validateUser = (req) => UserRequestSchema.validate(req.body, options)
