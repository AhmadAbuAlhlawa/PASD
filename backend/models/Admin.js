const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure email is unique
    username: { type: String, required: true, unique: true }, // Fixed typo in "unique"
    password: { type: String, required: true }
});


const logSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            trim: true
        },
        details: {
            type: String,
            required: true,
            trim: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        adminUsername: {
            type: String,
            required: true,
            trim: true
        }
    },
);

const Log = mongoose.model('Log', logSchema);


const AdminModel = mongoose.model("admins", AdminSchema);

module.exports = {
    Log,
    AdminModel
}
