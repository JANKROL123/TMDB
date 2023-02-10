const Joi = require("joi");
const roleSchema = Joi.object().keys({
    name: Joi.string().required(),
    character: Joi.string().required()
});
const movieSchema = Joi.object().keys({
    title: Joi.string().required(),
    poster_path: Joi.string().regex(/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/).required(),
    overview: Joi.string().required(),
    main_roles: Joi.array().items(roleSchema).min(3).required(),
    release_date: Joi.date().required(),
    director: Joi.string().required(),
    genre_ids: Joi.array().min(1).items(Joi.number()).required(),
    vote_average: Joi.number().min(0).max(10).required(),
    vote_count: Joi.number().min(0).required(),
    trailer: Joi.string().regex(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/).required(),
    popularity: Joi.number().min(0).required(),
});
module.exports = movieSchema;