const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

function basicDetails(language) {
    const { id, name, createdDate, updated } = language;
    return { id, name, createdDate, updated };
}

async function getAll() {
    const languages = await db.Language.find();
    return languages.map(x => basicDetails(x));
}

async function getById(id) {
    const language = await getLanguage(id);
    return basicDetails(language);
}

async function _delete(id) {
    const language = await getLanguage(id);
    await language.remove();
}

async function create(params) {
    // validate
    if (await db.Language.findOne({ name: params.name })) {
        throw 'Language "' + params.name + '" is already there';
    }
    const language = new db.Language(params);   
    // save language
    await language.save();
    return basicDetails(language);
}

async function update(id, params) {
    const language = await getLanguage(id);

    // validate (if email was changed)
    if (params.name && language.name !== params.name && await db.Language.findOne({ name: params.name })) {
        throw 'Language "' + params.email + '" is already present';
    }

    // copy params to language and save
    Object.assign(language, params);
    language.updated = Date.now();
    await language.save();
    return basicDetails(language);
}

// helper functions

async function getLanguage(id) {
    if (!db.isValidId(id)) throw 'Language not found';
    const language = await db.Language.findById(id);
    if (!language) throw 'Language not found';
    return language;
}