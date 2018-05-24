//I replaced This File with ScannedBags

var mongoose = require('mongoose');
var randomize = require('randomatic');

var BagsScanned = {

    createScannedSchema: function () {
        return new Promise((resolve, reject) => {

            var Schema = mongoose.Schema;
            // create a schema

            var sampleSchema =
                new Schema({
                    _id: false,
                    BagNumber: String,
                    ScannedDate: { type: Date, default: Date.now }
                });

            var SoldSchema =
                new Schema({
                    _id: false,
                    BagNumber: String,
                    SoldDate: { type: Date, default: Date.now }
                });

            var BagScanned = new Schema({
                container_Date: { type: Date, default: Date.now },
                scannedBagsArray: [sampleSchema],
                SoldBags: [SoldSchema]
            });

            if (mongoose.connection.modelNames()) {


                var schema = mongoose.connection.modelNames().
                    find(schema => schema == "BagScanned");

                if (schema) {
                    return resolve(mongoose.connection.model("BagScanned"));
                }
                else {

                    var Container = mongoose.model('BagScanned', BagScanned);

                    resolve(Container);
                }
            }
        });
    },

    StoreScannedBag: function (schema, BagNumber) {
        return new Promise((resolve, reject) => {
            schema.find({}).exec((err, allDocs) => {
                if (err) {

                    return reject(err);
                }

                if (!allDocs.length) {

                    var firstSChema = new schema({
                        scannedBagsArray: [{
                            BagNumber: BagNumber

                        }]
                    });
                    firstSChema.save((err) => {

                        if (err) {
                            return reject(err);

                        }

                        return resolve(true);

                    });

                }
                else {

                    allDocs[0].scannedBagsArray.push({
                        BagNumber: BagNumber
                    });
                    allDocs[0].save(err => {

                        if (err) {
                            return resolve(err``);
                        }
                        return resolve(true);
                    });

                }
            })

        });
    }


};
module.exports = BagsScanned;