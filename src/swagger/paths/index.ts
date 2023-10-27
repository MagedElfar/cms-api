import { Paths } from "swagger-jsdoc"
import authPath from "./auth.path"
import userPath from "./user.path"
import productPath from "./product.path"
import rolePath from "./role.path"
import permissionPath from "./permission.path"
import rolePermissionPath from "./rolePermission.path"
import categoryPath from "./category.path"
import productCategoryPath from "./productCategory.path"

const paths: Paths = {
    ...authPath,
    ...userPath,
    ...rolePath,
    ...permissionPath,
    ...productPath,
    ...rolePermissionPath,
    ...categoryPath,
    ...productCategoryPath
}

export default paths