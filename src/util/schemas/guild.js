import { Schema, model, models,SchemaTypes } from 'mongoose';

const guildScheam = new Schema({
    guild: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    announcement_id: {
        type: SchemaTypes.String,
        required: false,
    },
    voice_detection: {
        type: SchemaTypes.String,
        required: false,
    },
})


const guild = models.guild || model('guild', guildScheam);

export default guild;