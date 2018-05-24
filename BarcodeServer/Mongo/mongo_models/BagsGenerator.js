
var mongoose = require('mongoose');

var BagsNumberGenerator = {

    createBagGenerator: function () {

        return new Promise((resolve, reject) => {

            var Schema = mongoose.Schema;
            // create a schema
            var BagSchema = new Schema({
                BagNumbers: Number
            });


            //var BagNumbersGenerator =
            //    mongoose.model('BagNumbersGenerator', BagSchema);


            if (mongoose.connection.modelNames()) {


                var schema = mongoose.connection.modelNames().
                    find(schema => schema == "BagNumbersGenerator");

                if (schema) {

                    return resolve(mongoose.connection.model("BagNumbersGenerator"));
                }
                else {

                    var Container = mongoose.model('BagNumbersGenerator',
                        BagSchema);
                    return resolve(Container);
                }
            }


        })

    },
    GetBagNumber: function (Bagcontainer) {

        return new Promise((resolve, reject) => {

            Bagcontainer.find({}).exec((err, allDocs) => {

                if (!allDocs.length) {
                    BagsNumberGenerator.createNewBagGenerator(Bagcontainer)
                        .then((number) => {

                            return resolve(number);

                        });
                }
                else {
                    var newnumber = allDocs[0].BagNumbers += 1;
                    allDocs[0].BagNumbers = newnumber;
                    allDocs[0].save(err => {

                        if (err) {

                            return reject(err);
                        }

                        return resolve(newnumber);
                    })
                }
            })
        })
    },
    createNewBagGenerator: function (BagContainer) {
        return new Promise((resolve, reject) => {

            var Bag = new BagContainer({ BagNumbers: 265987 });

            Bag.save((err) => {

                if (err) {
                    reject(err);
                }

                return resolve(265987);

            })

        });
    },
    CreatBagNumberWithType: function (Type, Bagcontainer) {
        return new Promise((resolve, reject) => {
            BagsNumberGenerator.GetBagNumber(Bagcontainer).then((BagNumber) => {
                return resolve(type + "-" + BagNumber);
            })

        })
    }
}

module.exports = BagsNumberGenerator;