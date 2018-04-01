/* هذا الموديول لتخزين العناصر التي
 نقوم يمسحها عن طريق الموبايل  , 
 */
var mongoose = require('mongoose');
var randomize = require('randomatic');

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

            // the schema is useless so far
            // we need to create a model using it
            var Container = mongoose.model('ScannedProduct', ScannedProduct);

            resolve(Container);
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

                            return resolve(false);
                        })

                    }

                    if (lastContainer) {
                        CheckExistingProduct().then((isExist) => {
                            console.log(isExist)
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


            var blankContainer = new container({ container_number: containerNumber });
            blankContainer.save(err => {

                if (err) {
                    return reject(err);
                }
                return resolve(true);

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
                .then(function (exisDoc) {
                    if (exisDoc) {
                        return resolve(exisDoc)
                    }
                    else {
                        container.find()
                            .where("container_number").equals(containerNumber)
                            .exec(function (err, foundedContainers) {

                                if (foundedContainers.length != 0) {
                                    if (!foundedContainers[foundedContainers.length - 1].
                                        ClosedContainer) {
                                        resolve(foundedContainers[foundedContainers.length - 1]);
                                    }
                                    else
                                        return resolve(null);
                                }

                                else {
                                    ScannedProduct.
                                        AddBlankContainer(container, containerNumber)
                                        .then((isOpened) => {
                                            if (isOpened) {
                                                container.
                                                    findOne({ "container_number": containerNumber },
                                                    (err, lastContainer) => {
                                                        if (err) {

                                                            return reject()
                                                        }
                                                        return resolve(lastContainer)
                                                    })
                                            }

                                        })
                                }
                            });
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
                        return resolve(false);
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

            container.findOne({ ClosedContainer: false }).exec((err, doc) => {

                if (err) {
                    return reject(err)
                }

                return resolve(doc);

            })

        })
    }





};

module.exports = ScannedProduct;