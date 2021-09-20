// This is the verification schema file
// this is powered by Joi npm package

const { fileLoader } = require('ejs')
const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().required(),
            filename: Joi.string().required()
        }),
        location: Joi.string().required(),
        geometry: Joi.object({
            type: Joi.string().required(),
            coordinates: Joi.array().items(Joi.number()).required()
        }),
        author: Joi.string(),
        description: Joi.string().required()
    }).required(),
    deleteimages: Joi.array().items(Joi.string())
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body : Joi.string().required()
    }).required()
});