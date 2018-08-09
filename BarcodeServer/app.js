
//Import the mongoose module
var mongoose = require('mongoose');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var type = require("./Mongo/ProductTypes.js");
var container = require("./Mongo/Container.js");
var scannedContainer = require("./Mongo/mongo_models/ScannedProduct.js");
var BagGenerator = require("./Mongo/mongo_models/BagsGenerator.js");
var scannedBag = require("./Mongo/mongo_models/ScannedBags.js");
var productDegrees = require("./Mongo/mongo_models/ProductDegree.js");
var UserAuth = require("./Mongo/mongo_models/UserAuth.js");
var userAuth = new UserAuth();
var Customers = require("./Mongo/mongo_models/Customers.js");
var newCustomer = new Customers();

//Customers Module 

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
//????? ?????? ?????, ????? ?????? ?? ?????
//mongoDB = 'mongodb://localhost:27017/barcode_clothes';
//mongoose.connect('mongodb://127.0.0.2/test').exec()
//    .then(() => { // if all is ok we will be here
//        return server.start();
//    })
//    .catch(err => { // if error we will be here
//        console.error('App starting error:', err.stack);
//        process.exit(1);
//    });

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
                    console.log("cNo" + cNo);
                    //loggerInfo.info('Getting Container Number ', cNo, { number: cNo });
                    // CheckExistingSchema("ScannedProduct").then((sContaier) => {
                    scannedContainer.createScannedProductsSchema().then((sContaier) => {
                        scannedContainer.GetLastScannedContainer(sContaier, cNo)
                            .then((lastContainer) => {
                                if (lastContainer) {

                                    socket.emit("OpenedScannedDocument",
                                        lastContainer)

                                }
                                else {
                                    socket.emit("OpenedScannedDocument", null);

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
        scannedContainer.createScannedProductsSchema().then((container) => {
            scannedContainer.CloseContainer(container, containerNumber)
                .then((isClosed) => {
                    socket.emit("ClosedContainer", isClosed);
                });

        });
    });


    //??? ?????? ?????? ??  ??? ??????? 
    socket.emit("AddScannedProduct",
        (containerNumber, ScannedProductObject) => {

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

    socket.on("GetAllProductTypes", () => {

        type.createSchemaType().then((schemaType) => {

            type.readTypes(schemaType).then((allTypes) => {
                if (allTypes.length) {

                    socket.emit("GettingAllProductTypes", allTypes);
                }
                else
                    socket.emit("GettingAllProductTypes", allTypes);

            })

        });

    });


    socket.on("StoreNewProductTypes", (allNewTypes) => {

        type.createSchemaType().then((schemaType) => {

            type.CreateNewArrayTypes(schemaType, allNewTypes).then((state) => {

                console.log(state);
                socket.emit("StoringNewProductTypes", state);

            })

        });

        console.log(allNewTypes);
    })

    //??? ?????? ????? ??????? 
    //??????? 
    //Example :  b3ec0a7b-d5da-31d8-ffd8-149c7c8cc081
    socket.on("GenerateBagNumberFromServer", (BagType) => {


        BagGenerator.createBagGenerator().then((bagContainer) => {
            BagGenerator.GetBagNumber(bagContainer).then((no) => {
                var generatedNumber = BagType.trim() + "-" + no;
                console.log(generatedNumber);
                socket.emit("GeneratingBagNumberFromServer",
                    generatedNumber)


            });

        })
    })

    //Here we Generate Balla Number
    //(ccr-5466-465465):(type-ContainerNumber-GeneratedNumber)

    socket.on("GenerateProductNumberFromServer", (productType) => {
        console.log(Date())
        container.createContainer().then((containerSChema) => {
            container.getContainerNumber(containerSChema).then((cNo) => {

                if (cNo) {
                    //loggerInfo.info('Getting Container Number ', cNo, { number: cNo });
                    // CheckExistingSchema("ScannedProduct").then((sContaier) => {
                    scannedContainer.createScannedProductsSchema().then((sContaier) => {
                        scannedContainer.GetLastScannedContainer(sContaier, cNo)
                            .then((lastContainer) => {
                                if (lastContainer) {

                                    //Here Get Product Number
                                    BagGenerator.createBagGenerator().then((bagContainer) => {
                                        BagGenerator.GetBagNumber(bagContainer).then((no) => {
                                            var generatedNumber = productType.trim() +
                                                "-" + lastContainer.container_number + "-" + no;
                                            console.log(generatedNumber);
                                            console.log(Date())

                                            socket.emit("GeneratingProductNumberFromServer",
                                                generatedNumber);
                                        });
                                    })

                                }
                                else {
                                    socket.emit("GeneratingProductNumberFromServer", null)

                                    loggerInfo.error("There is no Opened Container!!");

                                }
                            })
                    });

                }
            }).catch((reason) => {

                console.log(reason);
            });

        })



    })


    socket.on("StoreScannedProduct", (scannedProducts, ContainerNumber) => {
        scannedContainer.createScannedProductsSchema().then((sContaier) => {
            scannedContainer.AddScannedProductTo(sContaier, ContainerNumber, scannedProducts)
                .then((lastContainer) => {

                    if (lastContainer) {

                        console.log("You have scanned " +
                            lastContainer + " New");


                    }
                    else {
                        console.log(lastContainer + "  Exists!!");
                        // socket.emit("OpenedScannedDocument", null)
                    }

                    socket.emit("ScanedProductsStored", lastContainer)


                })
        });

    })



    socket.on("StoringScannedBag", (scannedBags) => {
        scannedBag.createScannedSchema().then(schema => {
            scannedBag.StoreScannedBag(schema, scannedBags).then((savedItems) => {
                socket.emit("StoredScannedBag", savedItems);
            })
        })
    });

    /*
     
     Add Product degree to the products 
     Karatcht , ???? 2  , 

     */

    socket.on("AddingProductDegree", (newDegreesArray) => {
        productDegrees.CreatDegreeSchema().then(schema => {

            productDegrees.CreateAddNewDegrees(schema, newDegreesArray).then(saved => {
                socket.emit("GettingProductDegree", saved);
            })
        })
    })

    socket.on("GetAllProductDegrees", () => {
        productDegrees.CreatDegreeSchema().then(schema => {

            productDegrees.GetAllDegrees(schema).then(allDegrees => {

                socket.emit("GettingAllProductDegrees", allDegrees);

            })
        })
    })


    socket.on("UserAuthentication", (userData) => {


        userAuth.AllowToAccess(userData).then((IsValidUser) => {

            console.log(userData)

            socket.emit("IsValidUser", IsValidUser);

        })

    })

    //Customers Opeations
    socket.on("CreatingCustomer", (customerData) => {

        newCustomer.CreateCustomers(customerData).then((status) => {
            console.log(status)
            socket.emit("CreatedCustomer", status)

        })

    })

    socket.on("findingCustomer", (searchData) => {
        newCustomer.FindCustomer(searchData).then((foundedCustomer) => {
            socket.emit("FoundedCustomer", foundedCustomer)
        })

    })
    //End of Customer Operations
});

//Here Functions To generate GUID 

function guid() {
    return '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}


//End Of Functions

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

http.listen(port);
