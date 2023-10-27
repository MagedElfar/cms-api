import { COLUMN_TYPE } from "../services/entities.services";

export class CreateEntitiesDto {
    name: string
}

export class AddColumnDto {
    table: string;
    name: string;
    ref?: string;
    required: boolean;
    type: COLUMN_TYPE
}