import mongoose from "mongoose";
const { Schema, model } = mongoose;

const taskSchema = new Schema({
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
    completed: {
        type: Boolean,
        default: false
    },
    deadline: Date
}, {
    timestamps: true,
},
    { versionKey: false }
);

export default model('Task', taskSchema);