const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

async function verifyEmailExists(email) {
  const API_KEY = process.env.ZEROBOUNCE_API_KEY; // Store in .env file

  try {
    const response = await fetch(
      `https://api.zerobounce.net/v2/validate?api_key=${API_KEY}&email=${encodeURIComponent(
        email
      )}`
    );
    const data = await response.json();

    // Check if email exists and is not disposable/toxic
    if (data.status === "invalid") {
      throw new Error("Email address does not exist");
    }

    if (data.disposable) {
      throw new Error("Temporary/disposable emails are not allowed");
    }

    if (data.toxic || data.status === "spamtrap" || data.status === "abuse") {
      throw new Error("This email cannot be used");
    }

    // Accept valid and catch-all emails
    const acceptableStatuses = ["valid", "catch-all"];
    if (!acceptableStatuses.includes(data.status)) {
      throw new Error("Unable to verify email address");
    }

    return true;
  } catch (error) {
    throw new Error(error.message || "Email verification failed");
  }
}

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
      validate: [
        {
          // Synchronous validation - format check
          validator: function (value) {
            return validator.isEmail(value);
          },
          message: "Invalid email format",
        },
        {
          // Asynchronous validation - existence check
          validator: async function (value) {
            return await verifyEmailExists(value);
          },
          message: (props) => props.reason || "Email verification failed",
        },
      ],
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

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  return token;
};

userSchema.index({ emailId: 1, firstName: 1 });
const User = mongoose.model("user", userSchema);

module.exports = { User };
