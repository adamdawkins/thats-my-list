const Datastore = require('nedb');

// Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
// which doesn't get copied if someone remixes the project.
const db = new Datastore({ filename: '.data/datafile', autoload: true });


module.exports = db;