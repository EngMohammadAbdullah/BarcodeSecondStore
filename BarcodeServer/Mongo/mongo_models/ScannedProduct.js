
/* هذا الموديول لتخزين العناصر التي
 نقوم يمسحها عن طريق الموبايل  , 
 */
var mongoose = require('mongoose');
var randomize = require('randomatic');
var containerLib = require("../Container.js");

//Winston مكتبة لوغ 
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

var ScannedProduct = {

    //هنا لانشاء سكيما و من هنا نستطيع إنشاء أوبجكت  
    createScannedProductsSchema: function () {

        return new Promise((resolve, reject) => {
            var Schema = mongoose.Schema;
            var sampleSchema =
                new Schema({
                    _id: false,
                    productNumber: String,
                    productType: String,
                    ScannedDate: { type: Date, default: Date.now }
                });
            // create a schema
            var ScannedProduct = new Schema({

                container_number: String,
                container_Date: { type: Date, default: Date.now },
                scannedProductArray: [sampleSchema],
                ClosedContainer: { type: Boolean, default: false }
            });

            if (mongoose.connection.modelNames()) {


                var schema = mongoose.connection.modelNames().
                    find(schema => schema == "ScannedProduct");

                if (schema) {
                    return resolve(mongoose.connection.model("ScannedProduct"));
                }
                else {

                    var Container = mongoose.model('ScannedProduct', ScannedProduct);

                    resolve(Container);
                }
            }

        })

    },

    /*هنا لإضافة بالة جديدة إلى الكونتير  
     هنا نبحث عن كونتير عن طريق رقم الكونتير 
     ومن ثم نضيف أوبجكت إلى مصفوفة البالات 
     scannedProductArray
    */

    AddScannedProduct: function (container, containerNumber, ScannedProduct) {

        return new Promise((resolve, reject) => {
            this.GetLastScannedContainer(container, containerNumber)
                .then((lastContainer) => {
                    console.log(lastContainer);

                    function CheckExistingProduct() {
                        return new Promise((resolve, reject) => {

                            for (var i = 0; i < lastContainer.
                                scannedProductArray.length; i++) {

                                if (lastContainer.
                                    scannedProductArray[i].productNumber ==
                                    ScannedProduct.productNumber) {
                                    return resolve(true)
                                }
                            }


                            return resolve(false)


                        })

                    }

                    if (lastContainer) {
                        CheckExistingProduct().then((isExist) => {
                            if (isExist == false) {
                                lastContainer.scannedProductArray.push(ScannedProduct)
                                lastContainer.save((err) => {
                                    if (err) {
                                        reject(false);
                                    }

                                    return resolve(true);
                                })
                            }
                            else
                                return resolve(false);

                        })

                    }

                });
        });
    },

    AddBlankContainer: function (container, containerNumber) {

        return new Promise((resolve, reject) => {


            var blankContainer =
                new container({ container_number: containerNumber });
            blankContainer.save(err => {

                if (err) {
                    return reject(err);
                }

                containerLib.createContainer().then((con) => {
                    containerLib.removeContainerNumber(con)
                        .then((isRemoved) => {

                            if (isRemoved)

                                return resolve(true);

                            else
                                return resolve(false);
                        });

                })


            });
        });
    },

    /*
     هنا نناقش الحالات  التالية 
     1-      نبحث في حالة وجود مستند لديه قيمة 
               ClosedContainer: false
               فإن كان موجود يعيد المستند 
               أما إن لم يكن موجود نبحث عن مستند بهذا الرقم
               إن وجدنا المستند و لكن 
               ClosedContainer: true **
                  Null نعيد 
                إن لم نجده ننشأ مستند جديد برقم الذي نبحث عنه  
     */


    GetLastScannedContainer: function (container, containerNumber) {

        return new Promise((resolve, reject) => {
            ScannedProduct.IsExistOpenSCannedProduct(container)
                .then(function (existDoc) {
                    if (existDoc) {

                        return resolve(existDoc)
                    }
                    else {

                        //لم أرى داع لهذا الكود 
                        //طالما لا يوجد مستند مفتوح  
                        //لا يوجد داع 

                        //container.find()
                        //    .where("container_number").equals(containerNumber)
                        //    .exec(function (err, foundedContainers) {

                        //        if (foundedContainers.length != 0) {
                        //            if (!foundedContainers[foundedContainers.length - 1].
                        //                ClosedContainer) {
                        //                resolve(foundedContainers[foundedContainers.length - 1]);
                        //            }
                        //            else
                        //                return resolve(null);
                        //        }

                        //        else {
                        //  الكود التالي نعيده  إلى هنا 
                        //        }
                        //    });

                        ScannedProduct.
                            AddBlankContainer(container, containerNumber)
                            .then((isOpened) => {
                                if (isOpened) {
                                    container.
                                        findOne({ "container_number": containerNumber },
                                        (err, lastContainer) => {
                                            if (err) {
                                                loggerError.error(err);
                                                return reject()

                                            }
                                            return resolve(lastContainer)
                                        })
                                }
                                else {
                                    loggerError.error("حدث خطأ في حذف الرقم ",
                                        { number: containerNumber })
                                    return resolve(null);
                                }

                            })
                    }
                }).catch((reason) => {

                    console.log("reason" + reason)


                })


        });
    },

    ReopenContainer: function (container, containerNumber) {
        return new Promise((resolve, reject) => {

            container.
                findOne({ "container_number": containerNumber },
                (err, lastContainer) => {
                    if (err) {

                        return reject()
                    }
                    lastContainer.ClosedContainer = false;
                    lastContainer.save((err) => {
                        if (err) {

                            return reject()
                        }
                        return resolve(lastContainer);
                    })


                })

        })
    },

    CloseContainer: function (container, containerNumber) {

        return new Promise((resolve, reject) => {

            container.
                findOne({
                    container_number: containerNumber
                },
                (err, lastContainer) => {

                    if (err) {

                        return reject()
                    }


                    if (lastContainer.ClosedContainer) {
                        return resolve(false);
                    }

                    // هنا إذا كان عدد العناصر أقل من  400
                    // لا يقوم باللإغلاق !!

                    if (lastContainer.scannedProductArray.length < 400) {
                        return resolve("Less than 400 cannot closed!!");
                    }

                    lastContainer.ClosedContainer = true;

                    lastContainer.save((err) => {
                        if (err) {

                            return reject()
                        }

                        return resolve(true);
                    })
                });



        })

    },

    //هنا للتأكد من وجود كونتير مفتوح ,  
    // "ClosedContainer": false, 
    // و ذلك للتأكد قبل إنشاء كونتير جديد برقم جديد 

    IsExistOpenSCannedProduct: function (container) {
        return new Promise((resolve, reject) => {

            container.findOne({
                ClosedContainer: false
            }).exec((err, doc) => {

                if (err) {
                    return reject(err)
                }

                return resolve(doc);
            })

            // return resolve(null)

        })
    },

    getAllScannedContainerNumber: function (scannedContainer) {
        return new Promise((resolve, reject) => {
            var allScannedContainers = [];
            scannedContainer.find({}).exec((err, allDocs) => {

                for (var i = 0; i < allDocs.length; i++) {

                    allScannedContainers.push(allDocs[i].container_number);

                }

                return resolve(allScannedContainers);



            })


        })
    },

    GetAllScannedContainerNumberProducts: function (scannedContainer, containerNo) {
        return new Promise((resolve, reject) => {

            scannedContainer.findOne({ "container_number": containerNo.trim() }
                , (err, doc) => {

                    if (err) {

                        return reject(err);
                    }

                    return resolve(doc.scannedProductArray);

                });


        })
    },

    AddScannedProductTo: function (container, containerNumber, ScannedProducts) {
        return new Promise((resolve, reject) => {
            function FindDocumentBy() {
                return new Promise((resolve, reject) => {

                    container.findOne({ "container_number": containerNumber },
                        (err, lastContainer) => {
                            if (err) {

                                return reject()

                            }


                            return resolve(lastContainer)
                        })
                });
            }

            function ProductExist(Products, SearchedProduct) {
                console.log(SearchedProduct.productNumber);
                for (var i = 0; i < Products.length; i++) {
                    if (Products[i].productNumber ==
                        SearchedProduct.productNumber) {

                        return false;
                    }
                }

                return true;
            }

            function GetNonExistProducts(lastContainer) {
                return new Promise((resolve, reject) => {
                    var nonExistProducts = [];

                    if (lastContainer.
                        scannedProductArray.length == 0) {
                        return resolve(ScannedProducts);
                    }
                    else {

                        for (var i = 0; i < ScannedProducts.length; i++) {
                            if (ProductExist(lastContainer.
                                scannedProductArray, ScannedProducts[i])) {

                                nonExistProducts.push(ScannedProducts[i]);
                            }

                        }
                        return resolve(nonExistProducts);
                    }
                });
            }

            FindDocumentBy().then((lastContainer) => {
                if (lastContainer) {

                    GetNonExistProducts(lastContainer)
                        .then(nonExistProducts => {

                            for (var i = 0; i < nonExistProducts.length; i++) {
                                lastContainer.scannedProductArray.push(nonExistProducts[i])
                            }

                            lastContainer.save((err) => {
                                if (err) {
                                    reject(false);
                                }

                                return resolve(nonExistProducts.length);
                            })
                        })
                }
            })


        })
    }


};

module.exports = ScannedProduct;