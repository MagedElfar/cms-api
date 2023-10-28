import Joi from "joi";


const createModelSchema = Joi.object({

    name: Joi.string().regex(/^[A-Za-z_]+$/).required()
        .messages(
            {
                'string.pattern.base': 'Invalid characters in the name. Only letters, and underscores are allowed.',
            }
        ),
})


const removeEntitySchema = Joi.object({
    entity: Joi.string().disallow('refresh_token_list', 'users').required(),
})


export {
    createModelSchema,
    removeEntitySchema
}