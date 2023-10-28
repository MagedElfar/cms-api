import { Roles } from './../models/user.model';

export class CreateUserDto {
    name: string;
    email: string;
    password: string
    role: Roles
}


export class UpdateUserDto {
    name?: string;
    email?: string;
    password?: string
    role?: Roles
}

