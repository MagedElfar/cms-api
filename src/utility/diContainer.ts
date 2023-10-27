import { Logger } from "./logger";

export enum Dependencies {
    Logger = "logger",
    EmailServices = "emailServices",
    StorageServices = "storageServices",
    UserRepository = "userRepository",
    UserServices = "userServices",
    UserController = "userController",
    RefreshTokenRepository = "refreshTokenRepository",
    RefreshTokenServices = "refreshTokenServices",
    ProductRepository = "productRepository",
    ProductServices = "productServices",
    ProductController = "productController",
    ProductMediaRepository = "productMediaRepository",
    ProductMediaServices = "productMediaServices",
    JwtServices = "JwtServices",
    AuthServices = "authServices",
    AuthController = "authController",
    RoleRepository = "roleRepository",
    RoleServices = "roleServices",
    RoleController = "roleController",
    PermissionRepository = "permissionRepository",
    PermissionServices = "permissionServices",
    PermissionController = "permissionController",
    RolePermissionRepository = "rolePermissionRepository",
    RolePermissionServices = "rolePermissionServices",
    RolePermissionController = "rolePermissionController",
    CategoryRepository = "categoryRepository",
    CategoryServices = "categoryServices",
    CategoryController = "categoryController",
    ProductCategoryRepository = "productCategoryRepository",
    ProductCategoryServices = "productCategoryServices",
    ProductCategoryController = "productCategoryController",
    ProductAttributeRepository = "productAttributeRepository",
    ProductAttributeServices = "productAttributeServices",
    ProductAttributeController = "productAttributeController",
}

// diContainer.js
export default class DIContainer {
    private dependencies: any
    constructor() {
        this.dependencies = {};
    }

    register<T>(key: string, dependency: T): void {
        this.dependencies[key] = dependency;
    }

    resolve<T>(key: string): T {
        if (this.dependencies[key]) {
            return this.dependencies[key];
        }

        const logger = new Logger()
        throw new Error(`Dependency not found for key: ${key}`);
    }
}

// const dIContainer = DIContainer.createInstance();

// //register dependencies
// dIContainer.register(Dependencies.Logger, new Logger());

// dIContainer.register(Dependencies.EmailServices, new NodeMailerServices());

// dIContainer.register(Dependencies.StorageServices, new CloudStorageService(dIContainer.resolve(Dependencies.Logger)));


// //repository dependencies
// dIContainer.register(Dependencies.UserRepository, new UserRepository());

// dIContainer.register(Dependencies.RefreshTokenRepository, new RefreshTokenRepository());

// dIContainer.register(Dependencies.ProductRepository, new ProductRepository());

// dIContainer.register(Dependencies.ProductMediaRepository, new ProductMediaRepository());

// //services dependencies
// dIContainer.register(Dependencies.JwtServices, new JwtServices());

// dIContainer.register(Dependencies.RefreshTokenServices, new RefreshTokenServices(
//     dIContainer.resolve(Dependencies.RefreshTokenRepository),
//     dIContainer.resolve(Dependencies.JwtServices)
// ))

// dIContainer.register(Dependencies.UserServices, new UserServices(dIContainer.resolve(Dependencies.UserRepository)));

// dIContainer.register(Dependencies.AuthServices, new AuthServices(
//     dIContainer.resolve(Dependencies.UserServices),
//     dIContainer.resolve(Dependencies.JwtServices),
//     dIContainer.resolve(Dependencies.RefreshTokenServices),
//     dIContainer.resolve(Dependencies.EmailServices),
//     dIContainer.resolve(Dependencies.Logger)
// ));


// dIContainer.register(Dependencies.ProductServices, new ProductServices(dIContainer.resolve(Dependencies.ProductRepository)))

// dIContainer.register(Dependencies.ProductMediaServices, new ProductMediaServices(
//     dIContainer.resolve(Dependencies.ProductMediaRepository),
//     dIContainer.resolve(Dependencies.StorageServices)
// ));


// //controllers dependencies
// dIContainer.register(Dependencies.AuthController, new AuthController(
//     dIContainer.resolve(Dependencies.AuthServices),
//     dIContainer.resolve(Dependencies.Logger)
// ))

// dIContainer.register(Dependencies.UserController, new UserController(
//     dIContainer.resolve(Dependencies.UserServices),
//     dIContainer.resolve(Dependencies.Logger)
// ))

// dIContainer.register(Dependencies.ProductController, new ProductController(
//     dIContainer.resolve(Dependencies.ProductServices),
//     dIContainer.resolve(Dependencies.ProductMediaServices)
// ))
// export default dIContainer