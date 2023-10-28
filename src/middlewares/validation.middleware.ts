import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { BadRequestError } from "../utility/errors";
import * as dynamicModelValidation from "../validations/dynamicModel.validation"

export default function (schema: Joi.ObjectSchema, type = "body") {

    let reqType;

    return (req: Request, res: Response, next: NextFunction) => {

        console.log(req.body)

        switch (type) {
            case "query":
                reqType = req.query;
                break;

            case "param":
                reqType = req.params;
                break;

            case "body":
            default:
                reqType = req.body

        }

        const schemaErr = schema.validate(reqType, {
            abortEarly: false,
        })


        if (schemaErr.error) {
            // return next(setError(400, schemaErr.error?.message.split(". ")))

            return next(new BadRequestError(schemaErr.error?.message.split(".")))

        }

        next()
    }

}


function createRecordSchemaMiddleware(req: Request, res: Response, next: NextFunction) {

    const schemaErr = dynamicModelValidation.createRecordSchema(req).validate(req.body, {
        abortEarly: false,
    })

    if (schemaErr.error) {
        return next(new BadRequestError(schemaErr.error?.message.split(".")))
    }

    next()
}

function updateRecordSchemaMiddleware(req: Request, res: Response, next: NextFunction) {

    const schemaErr = dynamicModelValidation.updateRecordSchema(req).validate(req.body, {
        abortEarly: false,
    })

    if (schemaErr.error) {
        return next(new BadRequestError(schemaErr.error?.message.split(".")))
    }

    next()
}

function getAllRecordSchemaMiddleware(req: Request, res: Response, next: NextFunction) {

    const schemaErr = dynamicModelValidation.getAllRecordSchema(req).validate(req.query, {
        abortEarly: false,
    })

    if (schemaErr.error) {
        return next(new BadRequestError(schemaErr.error?.message.split(".")))
    }

    next()
}


export {
    createRecordSchemaMiddleware,
    updateRecordSchemaMiddleware,
    getAllRecordSchemaMiddleware
}