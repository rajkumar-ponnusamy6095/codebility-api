const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

function basicDetails(director) {
    const { id, firstName, lastName, createdDate, updated } = director;
    return { id, firstName, lastName, createdDate, updated };
}

async function getAll() {
    const directors = await db.Director.find();
    return directors.map(x => basicDetails(x));
}

async function getById(id) {
    const director = await getDirector(id);
    return basicDetails(director);
}

async function _delete(id) {
    const director = await getDirector(id);
    await director.remove();
}

async function create(params) {
    // validate
    if (await db.Director.findOne({ firstName: params.firstName })) {
        throw 'Director "' + params.firstName + '" is already there';
    }
    const director = new db.Director(params);   
    // save director
    await director.save();
    return basicDetails(director);
}

async function update(id, params) {
    const director = await getDirector(id);

    // validate (if email was changed)
    if (params.firstName && director.firstName !== params.firstName && await db.Director.findOne({ name: params.firstName })) {
        throw 'Director "' + params.firstName + '" is already present';
    }

    // copy params to director and save
    Object.assign(director, params);
    director.updated = Date.now();
    await director.save();
    return basicDetails(director);
}

// helper functions

async function getDirector(id) {
    if (!db.isValidId(id)) throw 'Director not found';
    const director = await db.Director.findById(id);
    if (!director) throw 'Director not found';
    return director;
}