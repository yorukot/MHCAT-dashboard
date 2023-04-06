import { Schema, model, models,SchemaTypes } from 'mongoose';

const userdataSchemas = new Schema({
    id: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    accessToken: {
        type: SchemaTypes.String,
        required: true,
    },
})


const userdata = models.userdata || model('userdata', userdataSchemas);

export default userdata;