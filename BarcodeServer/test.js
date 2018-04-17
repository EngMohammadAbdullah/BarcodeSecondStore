try {

    //Import the mongoose module
    var mongoose = require('mongoose');


    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise;

    //Set up default mongoose connection
    var mongoDB = 'mongodb://eng_mohammad:mohammad224@ds123312.mlab.com:23312/barcode_clothes';
    mongoose.connect(mongoDB);

    //Get the default connection
    var db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    var container = require("./Mongo/Container.js");
    var scannedContainer = require("./Mongo/mongo_models/ScannedProduct.js");

    var productTypes = require("./Mongo/ProductTypes.js");


    try {

        productTypes.createSchemaType().then((schema) => {

            productTypes.readTypes(schema).then((allTypes) => {
                if (!allTypes.length) {

                    console.log("لا يوجد عناصر لعرضها");

                }
                console.log(allTypes)

            })

        });


    } catch (e) {

    }


} catch (e) {
    console.log(e.message);
}


