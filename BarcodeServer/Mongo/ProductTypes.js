var mongoose = require('mongoose');
var randomize = require('randomatic');
var Type = require('./mongo_models/types_model.js');
var ProductTypes = {

    createType: function () {
        return new Promise((resolve, reject) => {

            var Schema = mongoose.Schema;

            // create a schema
            var TypeSchema = new Schema({ pName: String, pNumber: String });

            var TypesSchema = new Schema({
                types: [TypeSchema]
            });


            // the schema is useless so far
            // we need to create a model using it
            var Types = mongoose.model('Types', TypesSchema);

            resolve(Types);

        });
    },
    readTypes: function () {
        return new Promise((resolve, reject) => {


            Type.find(function (err, types) {
                if (err) {
                    return reject(err);
                }
                resolve(types[0].types);
            })


        });
    },
    GetTypeNumber: function (typeNumber) {
        return new Promise((resolve, reject) => {
            Type.find(function (err, types) {
                if (err) {
                    return reject(err);
                }

                for (var i = 0; i < types[0].types.length; i++) {

                    if (types[0].types[i].pName == typeNumber) {
                        resolve(types[0].types[i].pNumber);
                        break;
                    }
                }
                reject("No Number!!");
            });

        });
    }
};

module.exports = ProductTypes;