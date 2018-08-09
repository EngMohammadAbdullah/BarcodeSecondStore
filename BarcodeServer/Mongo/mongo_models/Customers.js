
var Customers = Customers || {};

var mongoose = require('mongoose');

Customers = function () {

    var schema = mongoose.Schema;
    var Customers = new schema({
        userName: String,
        familyName: String,
        PhoneNo: String,
        emailAddress: String
    });

    this.$createUserSchema = mongoose.model('Customers', Customers);
}

Customers.prototype.CreateCustomers = function (CustomersData) {

    return new Promise((resolve, reject) => {
        var me = this;



        var newCustomer = new me.$createUserSchema({

            userName: CustomersData.userName,
            familyName: CustomersData.familyName,
            PhoneNo: CustomersData.PhoneNo,
            emailAddress: CustomersData.emailAddress
        });
        newCustomer.save(err => {

            if (err) {
                return reject(err);
            }

            return resolve(true);

        })

    })
}

Customers.prototype.FindCustomer = function (searchData) {

    return new Promise((resolve, reject) => {
        var me = this;
        me.$createUserSchema.find({
            $or: [
                { userName: { "$regex": searchData, "$options": "i" } },
                { familyName: { "$regex": searchData, "$options": "i" } },
                { PhoneNo: { "$regex": searchData, "$options": "i" } },
                { emailAddress: { "$regex": searchData, "$options": "i" } }]
        },
            function (err, docs) {

                if (err) {

                    return reject(err);
                }


                return resolve(docs);

            });

    })
}

module.exports = Customers;