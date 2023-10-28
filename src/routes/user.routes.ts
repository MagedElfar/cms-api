import { UserController } from '../controllers/user.controllers';
import { Router } from "express"
import * as userValidation from "./../validations/user.validations"
import validation from "./../middlewares/validation.middleware"
import { Dependencies } from '../utility/diContainer';
import userDIContainer from '../dependencies/user.dependencies';
import { permissionMiddleware } from '../middlewares/permission.middleware';

const userRouter = Router();

const userController: UserController = userDIContainer.resolve(Dependencies.UserController)


userRouter.get(
    "/",
    validation(userValidation.getManySchema, "query"),
    userController.getUsersHandler.bind(userController)
)

userRouter.get(
    "/:id",
    userController.getUserByIdHandler.bind(userController)
)

userRouter.put(
    "/role/:id",
    validation(userValidation.updateUserRoleSchema),
    permissionMiddleware,
    userController.updateUserRoleHandler.bind(userController)
)

userRouter.put(
    "/",
    validation(userValidation.updateSchema),
    userController.updateUserHandler.bind(userController)
)

userRouter.put(
    "/:id",
    validation(userValidation.updateSchema),
    permissionMiddleware,
    userController.updateUserHandler.bind(userController)
)

userRouter.post(
    "/",
    permissionMiddleware,
    validation(userValidation.createSchema),
    userController.createUserHandler.bind(userController)
)

userRouter.delete(
    "/",
    permissionMiddleware,
    userController.deleteUserHandler.bind(userController)
)

userRouter.delete(
    "/:id",
    permissionMiddleware,
    userController.deleteUserHandler.bind(userController)
)


export default userRouter;