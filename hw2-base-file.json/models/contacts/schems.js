const Joi = require("joi");
const cJoi = Joi.extend(require("joi-phone-number"));

const schemaPost = Joi.object({
  name: cJoi.string().required(),
  email: cJoi.string().email().required(),
  phone: cJoi.string().phoneNumber().required(),
});

const schemaPut = Joi.object({
  name: cJoi.string(),
  email: cJoi.string().email(),
  phone: cJoi.string().phoneNumber(),
});

module.exports = { schemaPost, schemaPut };
