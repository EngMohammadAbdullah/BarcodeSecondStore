
var mongoose = require('mongoose');
var randomize = require('randomatic');

var ScannedBags = {

    createScannedSchema: function () {
        return new Promise((resolve, reject) => {

            var Schema = mongoose.Schema;
            // create a schema

            var sampleSchema =
                new Schema({
                    _id: false,
                    BagNumber: String,
                    BagType: String,
                    ScannedDate: { type: Date, default: Date.now }
                });

            var ScannedBags = new Schema({
                scannedBagsArray: [sampleSchema],
            });

            if (mongoose.connection.modelNames()) {


                var schema = mongoose.connection.modelNames().
                    find(schema => schema == "ScannedBags");

                if (schema) {
                    return resolve(mongoose.connection.model("ScannedBags"));
                }
                else {

                    var Container = mongoose.model('ScannedBags', ScannedBags);

                    resolve(Container);
                }
            }
        });
    },

    StoreScannedBag: function (schema, ScannedBags) {
        return new Promise((resolve, reject) => {

            function ProductExist(Products, SearchedProduct) {
                for (var i = 0; i < Products.length; i++) {
                    if (Products[i].BagNumber ==
                        SearchedProduct.BagNumber) {

                        return false;
                    }
                }

                return true;
            }

            function GetNonExistProducts(BagsDocument) {
                return new Promise((resolve, reject) => {
                    var nonExistProducts = [];

                    if (BagsDocument.
                        scannedBagsArray.length == 0) {
                        return resolve(ScannedBags);
                    }
                    else {

                        for (var i = 0; i < ScannedBags.length; i++) {
                            if (ProductExist(BagsDocument.
                                scannedBagsArray, ScannedBags[i])) {

                                nonExistProducts.push(ScannedBags[i]);
                            }

                        }
                        return resolve(nonExistProducts);
                    }
                });
            }

            schema.find({}).exec((err, allDocs) => {
                if (err) {

                    return reject(err);
                }

                if (!allDocs.length) {

                    var firstSChema = new schema({
                        scannedBagsArray: ScannedBags
                    });
                    firstSChema.save((err) => {

                        if (err) {
                            return reject(err);

                        }

                        return resolve(ScannedBags.length);

                    });

                }
                else {

                    GetNonExistProducts(allDocs[0])
                        .then(nonExistProducts => {
                            console.log(allDocs[0].scannedBagsArray);
                            for (var i = 0; i < nonExistProducts.length; i++) {
                                allDocs[0].scannedBagsArray.
                                    push(nonExistProducts[i])
                            }

                            allDocs[0].save((err) => {
                                if (err) {
                                    reject(false);
                                }

                                return resolve(nonExistProducts.length);
                            })
                        })


                }
            })

        });
    }


};
module.exports = ScannedBags;