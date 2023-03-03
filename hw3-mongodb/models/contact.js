const { Schema, model } = require("mongoose");
const Joi = require("joi").extend(require("joi-phone-number"));

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const schemaCreate = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().phoneNumber().required(),
  favorite: Joi.bool(),
});

const schemaUpdate = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().phoneNumber(),
  favorite: Joi.bool(),
});

const schemaPatch = Joi.object({
  favorite: Joi.bool()
    .required()
    .messages({ "any.required": "missing field favorite" }),
});

const Contact = model("contact", contactSchema);

module.exports = { Contact, schemaCreate, schemaUpdate, schemaPatch };
