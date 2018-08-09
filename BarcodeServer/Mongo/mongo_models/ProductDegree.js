var mongoose = require('mongoose');

var ProductDegree = {

    CreatDegreeSchema: function () {
        return new Promise((resolve, reject) => {

            var Schema = mongoose.Schema;

            // create a schema
            var DegreeSchema =
                new Schema({ dName: String, dNumber: String, shortcut: String });

            var DegreesSchema = new Schema({
                degrees: [DegreeSchema]
            });

            if (mongoose.connection.modelNames()) {


                var schema = mongoose.connection.modelNames().
                    find(schema => schema == "Degrees");

                if (schema) {
                    return resolve(mongoose.connection.model("Degrees"));
                }
                else {

                    var Container =
                        mongoose.model('Degrees', DegreesSchema);

                    resolve(Container);
                }
            }

        });

    },

    GetAllDegrees: (degreeSchema) => {

        return new Promise((resolve, reject) => {


            degreeSchema.find({}).exec((err, degrees) => {

                if (err) {
                    return reject(err);
                }
                return resolve(degrees[0].degrees)

            })

        });

    },

    GetDegreeShortcut: (degreeSchema, degreeName) => {

        return new Promise((resolve, reject) => {
            degreeSchema.find({}).exec((err, degrees) => {

                if (err) {
                    return reject(err);
                }

                for (var i = 0; i < degrees[0].degrees.length; i++) {
                    if (degrees[0].degrees[i].dName == degreeName) {
                        return resolve(degrees[0].degrees[i].shortcut)
                    }
                }


            })
        });

    },

    CreateAddNewDegrees: (degreeSchema, NewDegrees) => {
        return new Promise((resolve, reject) => {
            degreeSchema.find({}).exec((err, degrees) => {

                if (err) {
                    return reject(err);
                }

                if (degrees.length) {

                    degrees[0].degrees = NewDegrees;
                    degrees[0].save((err) => {

                        if (err) {
                            return reject(err)
                        }
                        return resolve(true);
                    })
                }
                else {

                    var NewProductDegrees = new degreeSchema(
                        { degrees: NewDegrees }
                    );

                    NewProductDegrees.save((err) => {

                        if (err) {
                            return reject(err)
                        }
                        return resolve(true);
                    })
                }

            })
        });
    }
}


module.exports = ProductDegree;