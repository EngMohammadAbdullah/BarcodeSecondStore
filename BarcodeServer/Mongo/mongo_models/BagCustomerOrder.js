var BagCustomerOrder = BagCustomerOrder || {};

var mongoose = require('mongoose');

BagCustomerOrder = function () {

    var schema = mongoose.Schema;

    var Customer = new schema({
        userName: String,
        familyName: String,
        PhoneNo: String,
        emailAddress: String
    });
    var bag = new schema({
        _id: false,
        BagNumber: String,
        BagType: String
    });

    var customerBagOrder = new schema({
        Customer: Customer,
        BoughtBags: [bag],
        OrderDate: { type: Date, default: Date.now },
        OrderWeight: { type: Number, default: 0 }
    });

    this.$createCustomerOrderSchema = mongoose.model('customerBagOrder', customerBagOrder);

}


BagCustomerOrder.prototype.CreateCustomerOrder = function (Customer,
    bagsOrder, OrderWeight) {

    return new Promise((resolve, reject) => {

        var me = this;
        var newOrder = new
            this.$createCustomerOrderSchema(
            {
                Customer: Customer,
                BoughtBags: bagsOrder,
                OrderWeight: OrderWeight
            });
        newOrder.save(err => {

            if (err) {
                return reject(err);
            }

            return resolve(true);

        })

    })
}





module.exports = BagCustomerOrder;