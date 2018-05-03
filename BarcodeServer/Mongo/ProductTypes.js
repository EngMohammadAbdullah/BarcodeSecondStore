var mongoose = require('mongoose');
var randomize = require('randomatic');
var Type = require('./mongo_models/types_model.js');

var ProductTypes = {

    createSchemaType: function () {
        return new Promise((resolve, reject) => {

            var Schema = mongoose.Schema;

            // create a schema
            var TypeSchema =
                new Schema({ pName: String, pNumber: String, Category: String });

            var TypesSchema = new Schema({
                types: [TypeSchema]
            });

            if (mongoose.connection.modelNames()) {


                var schema = mongoose.connection.modelNames().
                    find(schema => schema == "Types");

                if (schema) {
                    return resolve(mongoose.connection.model("Types"));
                }
                else {

                    var Container =
                        mongoose.model('Types', TypesSchema);

                    resolve(Container);
                }
            }

        });
    },

    readTypes: function (typeSchema) {

        return new Promise((resolve, reject) => {



            typeSchema.find({}).exec((err, types) => {

                if (err) {
                    return reject(err);
                }
                if (types.length) {

                    return resolve(types[0].types)

                }
                else
                    return resolve(types);
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
                    console.log(types[0].types[i])
                    if (types[0].types[i].pName == typeNumber) {
                       
                        resolve(types[0].types[i].pNumber);
                        break;
                    }
                }
                reject("No Number!!");
            });

        });
    },

    CreateNewArrayTypes: function (typeSchema, newTypes) {
        return new Promise((resolve, reject) => {

            typeSchema.find({}).exec((err, types) => {

                if (err) {
                    return reject(err);
                }
                if (types.length) {
                    types[0].types = newTypes;
                    types[0].save(err => {

                        if (err) {
                            return reject(err);
                        }

                        return resolve(true);
                    })

                }
                else
                    return resolve(false);
            })


        })
    }

};

module.exports = ProductTypes;