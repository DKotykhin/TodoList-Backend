import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TaskSchema = new Schema({     
    title: {
        type: String,
        required: true,               
    },
    subtitle: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,       
    },
}, {
    timestamps: true,
});

export default model('Task', TaskSchema);