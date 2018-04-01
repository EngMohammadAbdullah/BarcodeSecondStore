var mongoose = require('mongoose');
var randomize = require('randomatic');
var Container = require("./Container.js");
var productTypes = require("./productTypes.js");

var Product = {

    createProduct: function () {
        return new Promise((resolve, reject) => {
            var Schema = mongoose.Schema;

            // create a schema
            var productSchema = new Schema({
                containerNumber: String,
                productNumbers: []
            });


            // the schema is useless so far
            // we need to create a model using it

            var product = mongoose.model('product', productSchema);

            resolve(product);
        })

    },
    generateContainerProducts: function (containerProduct) {
        return new Promise((resolve, reject) => {
            Container.createContainer().then(function (container) {
                container.find(function (err, container) {

                    if (err) {
                        reject(err);
                    }
                    productTypes.readTypes().then(function (types) {

                        containerProduct.containerNumber = container[0].container_number[0];

                        for (var i = 0; i < types.length; i++) {

                            var obj = types[i][Object.keys(types[i])[0]];
                            for (var j = 0; j < 10; j++) {
                                var temp = obj + randomize('0', 4);
                                while (containerProduct.productNumbers.indexOf(temp) != -1) {
                                    temp = obj + randomize('0', 4);
                                }

                                containerProduct.productNumbers.push(temp);
                            }


                        }

                   

                        containerProduct.save(function (err) {
                            if (err) {
                                reject(err);
                            }

                            console.log('containerProduct saved successfully!');
                            container[0].container_number.splice(0, 1);
                            container[0].save(function (err) {
                                if (err) {
                                    reject(err);
                                }

                                console.log('Container saved successfully!');
                                resolve(containerProduct);
                            })


                        })


                    });
                    //var containerProduct = new Product.createProduct();


                })

            });

        });
    }
};

module.exports = Product;