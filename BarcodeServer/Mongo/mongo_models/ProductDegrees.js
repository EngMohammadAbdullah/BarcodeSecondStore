var mongoose = require('mongoose');
var ProductDegree = {

    CreateDegreeSchema: () => {

        return new Promise((resolve, reject) => {

            var Schema = mongoose.Schema;

            // create a schema
            var DegreeSchema =
                new Schema({ dName: String, dNumber: String, shortCut: String });

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
                        mongoose.model('Degrees', TypesSchema);

                    resolve(Container);
                }
            }

        });


    },

    ReadGegrees: (degreeSchema) => {
        return new Promise((resolve, reject) => {
            degreeSchema.find({}).exec((err, degrees) => {

                if (err) {
                    return reject(err);
                }
                if (degrees.length) {

                    return resolve(degrees[0].degrees)

                }
                else
                    return resolve(degrees);
            })


        })

    },

    GetDegreeNumber: function (degreeSchema, degreeName) {

        return new Promise((resolve, reject) => {
            degreeSchema.find(function (err, degrees) {
                if (err) {
                    return reject(err);
                }

                for (var i = 0; i < degrees[0].degrees.length; i++) {
                    console.log(degrees[0].degrees[i])
                    if (degrees[0].degrees[i].dName == degreeName) {

                        resolve(degrees[0].degrees[i].dNumber);
                        break;
                    }
                }
                reject("No Number!!");
            });
        });
    },

    CreateDegreeArrays: (degreeSchema, NewDegrees) => {
        return new Promise((resolve, reject) => {
            degreeSchema.find({}).exec((err, degrees) => {

                if (err) {
                    return reject(err)
                }

                if (degrees[0].degrees.length) {
                    degrees[0].degrees = NewDegrees;
                    degrees[0].save(err => {


                        if (err) {
                            return reject(err);
                        }

                        return resolve(true);

                    })
                } else {




                }


            })

        });

    }
}