import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    name: String,
    avatarURL: String,
}, {
    timestamps: true,
    versionKey: false
}
);

export default model('User', userSchema);