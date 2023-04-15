import { Schema, model, models,SchemaTypes } from 'mongoose';

const JoinMessageSchema = new Schema({
    guild: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    enable: {
        type: SchemaTypes.Boolean,
        required: true,
        unique: true,
    },
    message_content: {
        type: SchemaTypes.String,
        required: true,
    },
    color: {
        type: SchemaTypes.String,
        required: true,
    },
    channel: {
        type: SchemaTypes.String,
        required: true,
    },
    img: {
        type: SchemaTypes.String,
        required: true,
    },
})


const JoinMessage = models.JoinMessage || model('JoinMessage', JoinMessageSchema);

export default JoinMessage;