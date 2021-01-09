const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

function basicDetails(movie) {
    const { id, name, director, musicDirector, createdDate, updated } = movie;
    return { id, name, director, musicDirector, createdDate, updated };
}

async function getAll() {
    const movies = await db.Movie.find();
    return movies.map(x => basicDetails(x));
}

async function getById(id) {
    const movie = await getMovie(id);
    return basicDetails(movie);
}

async function _delete(id) {
    const movie = await getMovie(id);
    await movie.remove();
}

async function create(params) {
    // validate
    if (await db.Movie.findOne({ name: params.name })) {
        throw 'Movie "' + params.name + '" is already there';
    } else if(await db.Director.count({ _id: params.director }) <= 0) {
        throw 'Invalid value for director field';
    } else if(await db.MusicDirector.count({ _id: params.musicDirector }) <= 0) {
        throw 'Invalid value for music director field';
    }
    const movie = new db.Movie(params);   
    // save movie
    await movie.save();
    return basicDetails(movie);
}

async function update(id, params) {
    const movie = await getMovie(id);

    // validate (if email was changed)
    if (params.name && movie.name !== params.name && await db.Movie.findOne({ name: params.name })) {
        throw 'Movie "' + params.email + '" is already present';
    } else if(await db.Director.count({ _id: params.director }) <= 0) {
        throw 'Invalid value for director field';
    } else if(await db.MusicDirector.count({ _id: params.musicDirector }) <= 0) {
        throw 'Invalid value for music director field';
    }

    // copy params to movie and save
    Object.assign(movie, params);
    movie.updated = Date.now();
    await movie.save();
    return basicDetails(movie);
}

// helper functions

async function getMovie(id) {
    if (!db.isValidId(id)) throw 'Movie not found';
    const movie = await db.Movie.findById(id);
    if (!movie) throw 'Movie not found';
    return movie;
}