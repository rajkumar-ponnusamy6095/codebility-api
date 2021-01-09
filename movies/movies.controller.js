const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const movieService = require('./movie.service');


//routes
router.get('/', authorize(), getAll);
router.post('/', authorize(Role.Admin), createSchema, create);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), updateSchema, update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        director: Joi.string().required(),
        musicDirector: Joi.string().required()        
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        director: Joi.string().required(),
        musicDirector: Joi.string().required()         
    });
    validateRequest(req, next, schema);
}

function getAll(req, res, next) {
    movieService.getAll()
        .then(movies => res.json(movies))
        .catch(next);
}

function getById(req, res, next) {
    movieService.getById(req.params.id)
        .then(movie => movie ? res.json(movie) : res.sendStatus(404))
        .catch(next);
}

function update(req, res, next) {
    movieService.update(req.params.id, req.body)
        .then(movie => res.json(movie))
        .catch(next);
}

function create(req, res, next) {
    movieService.create(req.body)
        .then(movie => res.json(movie))
        .catch(next);
}

function _delete(req, res, next) {
    movieService.delete(req.params.id)
        .then(() => res.json({ message: 'Movie deleted successfully' }))
        .catch(next);
}