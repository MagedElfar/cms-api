import { IModel } from './../middlewares/mappedModel.middleware';

export class CreateRecordDto {
    data: any;
    model: IModel;
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
    model: IModel;
}

export class DeleteRecordDto extends GetRecordByIdDto { }