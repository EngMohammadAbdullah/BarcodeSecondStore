var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var TypeSchema = new Schema({ pName: String, pNumber: String });

var TypesSchema = new Schema({
    types: [TypeSchema]
});


// the schema is useless so far
// we need to create a model using it
module.exports = mongoose.model('Types', TypesSchema);