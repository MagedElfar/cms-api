import Joi from "joi";
import { Roles } from "../models/user.model";

const updateSchema = Joi.object({

    name: Joi.string().optional(),

    email: Joi.string().email().required(),

})

const updateUserRoleSchema = Joi.object({
    role: Joi.string().required().valid(...Object.values(Roles)),
})

export {
    updateSchema,
    updateUserRoleSchema
}