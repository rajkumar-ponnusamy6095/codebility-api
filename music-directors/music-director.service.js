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
    const directors = await db.MusicDirector.find();
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
    if (await db.MusicDirector.findOne({ firstName: params.firstName })) {
        throw 'Music Director "' + params.firstName + '" is already there';
    }
    const director = new db.MusicDirector(params);   
    // save director
    await director.save();
    return basicDetails(director);
}

async function update(id, params) {
    const director = await getDirector(id);

    // validate (if email was changed)
    if (params.firstName && director.firstName !== params.firstName && await db.MusicDirector.findOne({ name: params.firstName })) {
        throw 'Music Director "' + params.firstName + '" is already present';
    }

    // copy params to director and save
    Object.assign(director, params);
    director.updated = Date.now();
    await director.save();
    return basicDetails(director);
}

// helper functions

async function getDirector(id) {
    if (!db.isValidId(id)) throw 'Music Director not found';
    const director = await db.MusicDirector.findById(id);
    if (!director) throw 'Music Director not found';
    return director;
}