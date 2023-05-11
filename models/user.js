const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");
const randToken = require ("rand-token")

// Define a model to extract the parameters for a user
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "alumni"],
        default: "student",
    },
    graduationYear: {
        type: Number,
        required: true,
    },
    major: {
        type: String,
        required: true,
    },
    job: {
        type: String,
    },
    company: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    zipCode: {
        type: Number,
        min: 10000,
        max: 99999,
    },
    bio: {
        type: String,
    },
    interests: {
        type: String,
    },

    apiToken: {
        type: String,
    },

});

// Define a function to extract the parameters for a new User object from the request body
userSchema.pre("save", function (next) {
    let user = this;
    if (!user.apiToken) user.apiToken = randToken.generate(16);
    next();
});
  
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });


module.exports = mongoose.model("User", userSchema);
  