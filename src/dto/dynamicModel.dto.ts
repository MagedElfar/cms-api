import { COLUMN_TYPE } from "../services/dynamicModel.services";

export class CreateModelDto {
    name: string
}

export class AddColumnDto {
    table: string;
    name: string;
    ref?: string;
    required: boolean;
    type: COLUMN_TYPE
}