const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 10,
      maxLength: 100,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,

      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Storng password " + value);
        }
      },
    },
    gender: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      validate(value) {
        const allowed = ["male", "female", "others"];
        if (!allowed.includes(value)) {
          throw new Error(
            `Invalid gender type. Allowed values: ${allowed.join(", ")}`
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      required: true,
      trim: true,
      default: null,
    },
    photoUrl: {
      type: String,
      default:
        "https://villagesonmacarthur.com/wp-content/uploads/2020/12/Blank-Avatar.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL " + value);
        }
      },
    },
    shortDescription: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 5) throw new Error("Skills limit exceeded");
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DEV@link#3801", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.index({ emailId: 1, firstName: 1 });
const User = mongoose.model("user", userSchema);

module.exports = { User };
