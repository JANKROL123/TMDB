const Joi = require("joi");
const userSchema = Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().required()
});
module.exports = userSchema;