import { EntityAttributes } from "../models/entity.model";

export class CreateRecordDto {
    data: any;
    entity: EntityAttributes;
}

export class GetOneRecordDto extends CreateRecordDto { }

export class GetManyRecordDto extends CreateRecordDto {
    options: {
        page: number,
        limit: number
    }
}

export class UpdateRecordDto extends CreateRecordDto {
    id: number
}

export class GetRecordByIdDto {
    id: number;
    entity: EntityAttributes;
}

export class DeleteRecordDto extends GetRecordByIdDto { }