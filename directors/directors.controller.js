const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const directorService = require('./director.service');


//routes
router.get('/', authorize(), getAll);
router.post('/', authorize(Role.Admin), createSchema, create);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), updateSchema, update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName:  Joi.string().optional() 
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName:  Joi.string().optional()        
    });
    validateRequest(req, next, schema);
}

function getAll(req, res, next) {
    const limit = parseInt(req.query.limit) || 5; // Make sure to parse the limit to number
    const skip = parseInt(req.query.skip) || 0;// Make sure to parse the skip to number
    let sortBy = req.query.sortBy;
    let order = req.query.order;
    let search = req.query.search;
    let filter = req.query.filter;

    console.log("REQ:",req.query)
    directorService.getAll(limit, skip, sortBy, order, filter, search)
        .then(directors => res.json(directors))
        .catch(next);
}

function getById(req, res, next) {
    directorService.getById(req.params.id)
        .then(director => director ? res.json(director) : res.sendStatus(404))
        .catch(next);
}

function update(req, res, next) {
    directorService.update(req.params.id, req.body)
        .then(director => res.json(director))
        .catch(next);
}

function create(req, res, next) {
    directorService.create(req.body)
        .then(director => res.json(director))
        .catch(next);
}

function _delete(req, res, next) {
    directorService.delete(req.params.id)
        .then(() => res.json({ message: 'Director deleted successfully' }))
        .catch(next);
}