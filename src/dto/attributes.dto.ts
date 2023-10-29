import { COLUMN_TYPE, FK_CONSTRAINTS } from "../models/attribute.model";


export class CreateAttributesDto {
    name: string;
    required: boolean;
    type: COLUMN_TYPE
    refId?: number
    onDelete?: FK_CONSTRAINTS
    onUpdate?: FK_CONSTRAINTS
}

export class UpdateAttributesDto {
    id: number
    name?: string;
    required?: boolean;
    type?: COLUMN_TYPE
    refId?: number
    onDelete?: FK_CONSTRAINTS
    onUpdate?: FK_CONSTRAINTS
}
