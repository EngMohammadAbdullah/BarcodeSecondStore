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
    var winston = require('winston');
    var loggerInfo = new winston.Logger({
        level: 'info',
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: __dirname + '/LogFiles/info.log' })
        ]
    });
    var loggerError = new winston.Logger({
        level: 'error',
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: __dirname + '/LogFiles/error.log' })
        ]
    });

    loggerInfo.info('Create Container Number %s', 'first', 'second', { number: 123 });
    loggerError.error('Hello again distributed logs');
    try {

        container.createContainer().then((cc) => {

            container.getContainerNumber(cc).then((cNo) => {
                if (cNo) {

                    container.removeContainerNumber(cc)


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


