import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'UserName required'],
        minlength: [2, 'Too short user name'],
        maxlength: [32, 'Too long user name'],
    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: [true, 'email must be unique'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'password required'],
        minlength: [2, 'Too short password'],
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: [true, 'phone required'],
        minlength: [12, 'Too short phone number'],
        maxlength: [12, 'Too long phone number'],
    },
    IdImage: {
        path: {
            type: String,
            required: [true, 'Image path required'],
        },
        publicId: {
            type: String,
            required: [true, 'Image publicId required'],
        }
    },

}, {
    timestamps: true
})

const userModel = mongoose.models.User || mongoose.model("User",userSchema)
export default userModel
