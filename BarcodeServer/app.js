//Import the mongoose module
var mongoose = require('mongoose');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var type = require("./Mongo/ProductTypes.js");
var container = require("./Mongo/Container.js");
var scannedContainer = require("./Mongo/mongo_models/ScannedProduct.js");
var port = 3000;

//Winston ????? ??? 
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

//end of Initialize Winston !!


// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Set up default mongoose connection
var mongoDB = 'mongodb://eng_mohammad:mohammad224@ds123312.mlab.com:23312/barcode_clothes';

mongoose.connect(mongoDB);



//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.get('/', function (req, res) {
    res.send("Good");
});


io.on('connection', function (socket) {

    socket.on("GetProductNumber", function (productName) {
        type.GetTypeNumber(productName).then(function (productNumber) {
            console.log("\n" + productNumber + "\n");
            socket.emit("SetProductNumber", productNumber);
        });
    });

    //socket.emit()
    //??? ??? ??????? ,????? ??????? ???????? !!
    socket.on('Server', function (msg) {

        console.log(' \n message: ' + msg + '\n');

        socket.emit("news", "I am From  Server");

    });

    /*
     ScannedProduct ??? ???? ????? 
     ??? ????? ?? ??????? ?? ??? ???? ????? ????? , 
     */
    socket.on('OpenScannedDocument', () => {



        //CheckExistingSchema("Container").then((containerSChema) => {

        container.createContainer().then((containerSChema) => {
            container.getContainerNumber(containerSChema).then((cNo) => {

                if (cNo) {

                    loggerInfo.info('Getting Container Number ', cNo, { number: cNo });
                    // CheckExistingSchema("ScannedProduct").then((sContaier) => {
                    scannedContainer.createScannedProductsSchema().then((sContaier) => {
                        scannedContainer.GetLastScannedContainer(sContaier, cNo)
                            .then((lastContainer) => {
                                if (lastContainer) {

                                    socket.emit("OpenedScannedDocument", lastContainer)

                                }
                                else {
                                    socket.emit("OpenedScannedDocument", null)

                                    loggerInfo.error("There is no Opened Container!!");

                                }
                            })

                    });

                }
            }).catch((reason) => {

                console.log(reason);
            });

        })


    });

    //Create New Document 
    socket.on("AddNewBlankScannedContainer", function (containerNumber) {
        scannedProduct.createScannedProductsSchema().then((container) => {
            scannedProduct.AddBlankContainer(container, containerNumber)
                .then((Isopened) => {
                    socket.emit("AddedContainer", Isopened);
                });

        });
    });

    //Create New Document 
    socket.on("CloseingContainer", function (containerNumber) {
        scannedProduct.createScannedProductsSchema().then((container) => {
            scannedProduct.CloseContainer(container, containerNumber)
                .then((isClosed) => {
                    socket.emit("ClosedContainer", true);
                });

        });
    });


    //??? ?????? ?????? ??  ??? ??????? 
    socket.emit("AddScannedProduct", (containerNumber, ScannedProductObject) => {

        scannedProduct.createScannedProductsSchema().then((container) => {

            scannedProduct.AddScannedProduct(container, containerNumber, ScannedProductObject)
                .then((IsSaved) => {

                    console.log("Item  " + IsSaved ? "True Saved !!" : "not Saved");

                });

        });



    })


    socket.on("GetAllScannedContainerNumbers", () => {
        scannedContainer.createScannedProductsSchema().then((sContaier) => {

            scannedContainer.getAllScannedContainerNumber(sContaier).then((allSCannedContainer) => {
               
                socket.emit("GettingAllScannedContainerNumbers", allSCannedContainer)

            })

        });


    })


    socket.on("GellAllScannedProducts", (container_number) => {

        scannedContainer.createScannedProductsSchema().then((sContaier) => {

            scannedContainer.
                GetAllScannedContainerNumberProducts(sContaier, container_number)
                .then((allSCannedProducts) => {
                   
                    socket.emit("GettingAllScannedContainerNumbers", allSCannedProducts)

                });

        });

    })


});


//??? ?????? ?? ???? ??????? 
function CheckExistingSchema(schemaName) {
    return new Promise((resolve, reject) => {

        if (mongoose.connection.modelNames()) {


            var schema = mongoose.connection.modelNames().
                find(schema => schema == schemaName);

            if (schema) {
                return resolve(mongoose.connection.model(schemaName));
            }
            else
                switch (schemaName) {
                    case "Container":

                        container.createContainer().then((container) => {

                            return resolve(container);
                        })
                        break;
                    case "ScannedProduct":
                        scannedContainer.createScannedProductsSchema().then((scannedDoc) => {

                            return resolve(scannedDoc);
                        })
                        break;


                }
        }



    })
}
process.on('uncaughtException', function (err) {
    console.log(err.message);
})
process.on('exit', function () {
    console.log("exit");
})
process.on('SIGTERM', function () {
    console.log("SIGTERM");
})
http.on('listening', function () {
    console.log('ok, server is running');
});

http.listen(3000);
