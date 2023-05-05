import { Schema, model, models,SchemaTypes } from 'mongoose';

const work_somethingSchemas = new Schema({
    guild: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    name: {
        type: SchemaTypes.String,
        required: true,
    },
    time: {
        type: SchemaTypes.Number,
        required: true,
    },
    energy: {
        type: SchemaTypes.Number,
        required: true,
    },
    coin: {
        type: SchemaTypes.Number,
        required: true,
    },
    role: {
        default: null,
        type: SchemaTypes.String,
        required: false,
    }
})


const WorkSomething = models.work_something || model('work_something', work_somethingSchemas);

export default WorkSomething;