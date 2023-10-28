import Joi from "joi";
import { Roles } from "../models/user.model";

const updateSchema = Joi.object({

    name: Joi.string().optional(),

    email: Joi.string().email().required(),

})

const updateUserRoleSchema = Joi.object({
    role: Joi.string().required().valid(...Object.values(Roles)),
})

const createSchema = Joi.object({

    name: Joi.string()
        .required()
        .messages({
            "string.min": "username must be at least 3 characters",
            "any.required": "username is required"
        }),

    password: Joi.string()
        .required()
        .min(8)
        .max(16),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "invalid email format"
        }),

    role: Joi.string().required().valid(...Object.values(Roles)),

})
export {
    updateSchema,
    updateUserRoleSchema,
    createSchema
}