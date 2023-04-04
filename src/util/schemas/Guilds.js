import { Schema, model, models,SchemaTypes } from 'mongoose';

const GuildsSchema = new Schema({
    id: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    guilds: {
        type: SchemaTypes.Array,
        required: true,
    },
    updatetime: {
        type: SchemaTypes.Number,
        required: true,
    }
})


const guilds = models.guilds || model('guilds', GuildsSchema);

export default guilds;