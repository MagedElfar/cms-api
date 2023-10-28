import { IModel } from "../middlewares/mappedModel.middleware"

declare global {
    type UserAttributes = import("../models/user.model").UserAttributes
    namespace Express {
        interface User extends UserAttributes { }
        interface Request {
            model: IModel
            refreshToken?: string,
            user?: UserAttributes
        }
    }
}

export { }