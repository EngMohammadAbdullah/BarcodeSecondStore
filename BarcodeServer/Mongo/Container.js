
var mongoose = require('mongoose');
var randomize = require('randomatic');

var Container = {

    createContainer: function () {
        return new Promise((resolve, reject) => {
            var Schema = mongoose.Schema;

            // create a schema
            var containerSchema = new Schema({
                container_number: []
            });

            if (mongoose.connection.modelNames()) {


                var schema = mongoose.connection.modelNames().
                    find(schema => schema == "Container");

                if (schema) {
                    return resolve(mongoose.connection.model("Container"));
                }
                else {
                    // the schema is useless so far
                    // we need to create a model using it
                    var Container = mongoose.model('Container', containerSchema);


                    return resolve(Container);
                }
            }



        })

    },

    generateContainerNumbers: function (container) {
        return new Promise((resolve, reject) => {

            for (var i = 0; i < 1000; i++) {
                var temp = randomize('0', 4);
                while (container.container_number.indexOf(temp) != -1) {
                    var temp = randomize('0', 4);
                }
                container.container_number.push(temp);

            }

            container.save(function (err) {
                if (err) {
                    return reject(err)
                }
                console.log("created!!");
                resolve()
            })

        });
    },

    getContainerNumber: function (container) {

        return new Promise((resolve, reject) => {

            var query = container.find({});
            query.exec((err, containerDoc) => {

                if (containerDoc[0].container_number.length) {

                    var containerNumber =
                        containerDoc[0].container_number[0];
                    return resolve(containerNumber);

                }
                else
                    reject("There is no enouph container Numbers")

            });





        });
    },


    removeContainerNumber: function (container) {

        return new Promise((resolve, reject) => {


            var query = container.find({});
            query.exec((err, containerDoc) => {

                if (containerDoc[0].container_number.length) {

                    
                    containerDoc[0].container_number =
                        containerDoc[0].container_number.slice(1);

                    containerDoc[0].save((err) => {

                        if (err) {

                            reject(err)
                        }
                        return resolve(true);

                    });
                }
                else
                    reject("there was an error in Deleting Container Number");



            });


        })



    }

};

module.exports = Container;