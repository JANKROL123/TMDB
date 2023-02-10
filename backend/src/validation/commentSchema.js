const Joi = require("joi");
const commentSchema = Joi.object().keys({
    date: Joi.date().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    userId: Joi.number().required()
});
module.exports = commentSchema;