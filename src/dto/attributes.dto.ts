import { COLUMN_TYPE } from "../services/attributes.services";

export class AttributesDto {
    name: string;
    ref?: string;
    required: boolean;
    type: COLUMN_TYPE
}

export class CreateAttributesDto {
    entity: string;
    attribute: AttributesDto[]
}

export class RemoveAttributeDto {
    entity: string
    attribute: string
}

export class RenameAttributeDto {
    entity: string
    attribute: string
    newName: string
}

export class GetAttributeDto {
    entity: string
}