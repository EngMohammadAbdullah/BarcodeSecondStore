var mongoose = require('mongoose');
var randomize = require('randomatic');

var Types = {

    createTypes: function () {
        return new Promise((resolve, reject) => {
            var Schema = mongoose.Schema;

            // create a schema
            var containerSchema = new Schema({
                container_number: []
            });

            // the schema is useless so far
            // we need to create a model using it
            var Container = mongoose.model('Container', containerSchema);

            resolve(Container);
        })

    },
    GetAllTypes: function () {
        return new Promise((resolve, reject) => {


        });
    }
};

module.exports = Container;