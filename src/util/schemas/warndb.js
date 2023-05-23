import { Schema, model, models,SchemaTypes } from 'mongoose';

const warndbSchemas = new Schema({
    time: {
        type: SchemaTypes.String,
        required: true,
    },
    guild: {
        type: SchemaTypes.String,
        required: true,
    },
    user: {
        type: SchemaTypes.String,
        required: true,
    },
    content: {
        type: SchemaTypes.Array,
        required: true,
    },
})

const warndb = models.warndb || model('warndb', warndbSchemas);

export default warndb;