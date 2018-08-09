//try {

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
var ScannedBag = require("./Mongo/mongo_models/ScannedBags");
var productTypes = require("./Mongo/ProductTypes.js");
var productDegrees = require("./Mongo/mongo_models/ProductDegree.js");
var UserAuth = require("./Mongo/mongo_models/Customers.js");
var newCustomer = new UserAuth();

var CustomerOrder = require("./Mongo/mongo_models/BagCustomerOrder.js");
var customerOrder = new CustomerOrder();


var userData = {

    userName: "Ammar",
    familyName: "Abdullah",
    PhoneNo: "0465919770",
    emailAddress: "Ammar@gmail.com"

}


var BoughtBags = [
    {

        "BagNumber": "465454798300",
        "BagType": "CCR"
    },
    {

        "BagNumber": "465454798311",
        "BagType": "CCR"
    },
    {

        "BagType": "CCH",
        "BagNumber": "465454798322"
    }]


customerOrder.CreateCustomerOrder(userData, BoughtBags,10).then((rr) => {

    console.log(rr)

})


    //} catch (e) {

    //}


//} catch (e) {
//    console.log(e.message);
//}


