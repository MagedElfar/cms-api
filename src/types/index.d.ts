import { IModel } from "../middlewares/mappedModel.middleware"
import { EntityAttributes } from "../models/entity.model"

declare global {
    type UserAttributes = import("../models/user.model").UserAttributes
    namespace Express {
        interface User extends UserAttributes { }
        interface Request {
            entity: EntityAttributes
            refreshToken?: string,
            user?: UserAttributes
        }
    }
}

export { }