import { CreateRecordDto, DeleteRecordDto, GetManyRecordDto, GetOneRecordDto, GetRecordByIdDto, UpdateRecordDto } from "../dto/dynamicModel.dto";
import { IDynamicRepository } from "../repositories/dynamicModel.repository";
import EntityRepository from "../repositories/entity.repository";
import { BadRequestError, NotFoundError } from "../utility/errors";
import moment from "moment";

export interface IDynamicModelServices {
    createRecord(createRecordDto: CreateRecordDto): Promise<any>;
    updateRecord(updateRecordDto: UpdateRecordDto): Promise<any>;
    getOneRecord(getOneRecordDto: GetOneRecordDto): Promise<any>;
    getRecordById(getRecordByIdDto: GetRecordByIdDto): Promise<any>;
    getManyRecords(getManyRecordDto: GetManyRecordDto): Promise<any>;
    deleteRecord(deleteRecordDto: DeleteRecordDto): Promise<any>
}

export default class DynamicModelServices implements IDynamicModelServices {

    private dynamicRepository: IDynamicRepository

    constructor(dynamicRepository: IDynamicRepository) {
        this.dynamicRepository = dynamicRepository
    }

    async getOneRecord(getOneRecordDto: GetOneRecordDto): Promise<any> {
        try {
            const record = await this.dynamicRepository.findOneRecord(getOneRecordDto)

            return record;
        } catch (error) {
            throw error
        }
    }

    async createRecord(createRecordDto: CreateRecordDto): Promise<any> {
        try {

            const attributes = createRecordDto.entity.attributes || [];

            const references = attributes.filter(item => item.ref)
            const dateAttr = attributes.filter(item => item.type === "DATE")

            dateAttr.forEach(attr => {

                if (createRecordDto.data[attr.name!]) {
                    console.log(createRecordDto.data[attr.name!])
                    if (!moment(createRecordDto.data[attr.name!], 'YYYY-MM-DD', true).isValid())
                        throw new BadRequestError(`${attr.name!} has invalid date format right format is 'YYYY-MM-DD'`)
                }
            })

            await Promise.all(references.map(async (attr) => {
                if (attr && createRecordDto.data[attr.name!]) {
                    const record = await this.getOneRecord({
                        data: { id: createRecordDto.data[attr.name!] },
                        entity: attr.ref!
                    })

                    if (!record) throw new NotFoundError(`record not found in '${attr.ref?.name}' reference `)
                }
            }))


            return await this.dynamicRepository.createRecord(createRecordDto)
        } catch (error) {
            throw error
        }
    }

    async updateRecord(updateRecordDto: UpdateRecordDto): Promise<any> {
        try {
            const attributes = updateRecordDto.entity.attributes || [];

            const references = attributes.filter(item => item.ref)
            const dateAttr = attributes.filter(item => item.type === "DATE")

            dateAttr.forEach(attr => {

                if (updateRecordDto.data[attr.name!]) {
                    console.log(updateRecordDto.data[attr.name!])
                    if (!moment(updateRecordDto.data[attr.name!], 'YYYY-MM-DD', true).isValid())
                        throw new BadRequestError(`${attr.name!} has invalid date format right format is 'YYYY-MM-DD'`)
                }
            })
            await Promise.all(references.map(async (attr) => {
                if (attr && updateRecordDto.data[attr.name!]) {
                    const record = await this.getOneRecord({
                        data: { id: updateRecordDto.data[attr.name!] },
                        entity: attr.ref!
                    })
                    if (!record) throw new NotFoundError(`record not found in reference table '${attr.ref?.name}'`)
                }
            }))

            const isUpdated = await this.dynamicRepository.updateRecord(updateRecordDto)

            if (isUpdated) throw new NotFoundError("Record Not Found")

            return
        } catch (error) {
            throw error
        }
    }

    async getRecordById(getRecordByIdDto: GetRecordByIdDto): Promise<any> {
        try {
            const record = await this.dynamicRepository.findRecordById(getRecordByIdDto)

            if (!record) throw new NotFoundError("Record Not Found");

            return record;
        } catch (error) {
            throw error
        }
    }

    async getManyRecords(getManyRecordDto: GetManyRecordDto): Promise<any> {
        try {
            const records = await this.dynamicRepository.findManyRecord(getManyRecordDto)

            return records;
        } catch (error) {
            throw error
        }
    }

    async deleteRecord(deleteRecordDto: DeleteRecordDto): Promise<any> {
        try {
            const isDelete = await this.dynamicRepository.deleteRecord(deleteRecordDto)

            if (!isDelete) throw new NotFoundError()

            return;
        } catch (error) {
            throw error
        }
    }
}