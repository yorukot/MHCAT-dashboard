import { Schema, model, models,SchemaTypes } from 'mongoose';

const GuildSchema = new Schema({
    id: {
        type: SchemaTypes.String,
        required: true,
    },
    name: {
        type: SchemaTypes.String,
        required: true,
    },
    icon: {
        type: SchemaTypes.String,
        required: false,
    },
    roles: {
        type: SchemaTypes.Array,
        required: true,
    },
    channels: {
        type: SchemaTypes.Array,
        required: true,
    },
    updatetime: {
        type: SchemaTypes.Number,
        required: true,
    }
})


const guildData = models.guildData || model('guildData', GuildSchema);

export default guildData;