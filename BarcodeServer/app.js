
//Import the mongoose module
var mongoose = require('mongoose');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var type = require("./Mongo/ProductTypes.js");
var scannedProduct = require("./Mongo/mongo_models/ScannedProduct.js");

var port = 3000;

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

        

    })
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

});

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
