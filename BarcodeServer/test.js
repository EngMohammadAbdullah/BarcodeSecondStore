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

    try {

        container.createContainer().then((cc) => {

            container.getContainerNumber(cc).then((cNo) => {
                if (cNo) {

                    console.log(cNo);
                    scannedContainer.createScannedProductsSchema().then(sContaier => {

                        scannedContainer.GetLastScannedContainer(sContaier, cNo)
                            .then((lastContainer) => {
                                if (lastContainer) {
                                    scannedContainer.CloseContainer(
                                        sContaier, lastContainer.container_number).
                                        then((isClosed) => {
                                            console.log("ddddd");
                                            if (isClosed) {

                                                console.log("Closed");
                                                console.log(lastContainer);

                                            }
                                            else
                                                console.log("The Container already Closed!!");


                                        })

                                }
                                else {
                                    console.log("There is no Opened Container!!")
                                }
                            })

                    });



                }
            }).catch((reason) => {

                console.log(reason);
            });
        });


    } catch (e) {
        console.log(e.message)
    }


} catch (e) {
    console.log(e.message);
}


