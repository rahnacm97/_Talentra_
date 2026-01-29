"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return new this.model(data).save();
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async findByEmail(email) {
        return this.model.findOne({ email }).exec();
    }
    async findAll(query = {}, page = 1, limit = 10) {
        return this.model
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }
    async count(query = {}) {
        return this.model.countDocuments(query).exec();
    }
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async delete(id) {
        const result = await this.model.findByIdAndDelete(id).exec();
        return !!result;
    }
    async verifyEmail(id) {
        return this.model
            .findByIdAndUpdate(id, {
            emailVerified: true,
            updatedAt: new Date(),
        }, { new: true })
            .exec();
    }
    async aggregate(pipeline) {
        return this.model.aggregate(pipeline).exec();
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map