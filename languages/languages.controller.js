const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const languageService = require('./language.service');


//routes
router.get('/', authorize(), getAll);
router.post('/', authorize(Role.Admin), createSchema, create);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), updateSchema, update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required()        
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required()        
    });
    validateRequest(req, next, schema);
}

function getAll(req, res, next) {
    languageService.getAll()
        .then(languages => res.json(languages))
        .catch(next);
}

function getById(req, res, next) {
    languageService.getById(req.params.id)
        .then(language => language ? res.json(language) : res.sendStatus(404))
        .catch(next);
}

function update(req, res, next) {
    languageService.update(req.params.id, req.body)
        .then(language => res.json(language))
        .catch(next);
}

function create(req, res, next) {
    languageService.create(req.body)
        .then(language => res.json(language))
        .catch(next);
}

function _delete(req, res, next) {
    languageService.delete(req.params.id)
        .then(() => res.json({ message: 'Language deleted successfully' }))
        .catch(next);
}