const { Schema, model } = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const {v4} = require("uuid");

const emailmask =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 5,
    },
    email: {
      type: String,
      match: emailmask,
      required: [true, "Email is required"],
      unique: true,
    },
    avatarURL: {
      type: String,
      default: "",
    },

    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
        verify: {
          type: Boolean,
          default: false,
        },
        verifyToken: {
          type: String,
          required: [true, 'Verify token is required'],
        },
    
  },
  { versionKey: false, timestamps: true }
);

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.createVerifyToken = function() {
    this.verifyToken = v4();
}

const joiUserSchema = Joi.object({
  password: Joi.string().min(5).required(),
  email: Joi.string().pattern(emailmask).required(),
  avatarURL: Joi.string(),
});

const User = model("user", userSchema);

module.exports = { User, joiUserSchema };
