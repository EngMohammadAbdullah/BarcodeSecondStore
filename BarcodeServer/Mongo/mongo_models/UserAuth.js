var UserAuth = UserAuth || {};
var mongoose = require('mongoose');

UserAuth = function () {

    var schema = mongoose.Schema;
    var UserAuth = new schema({
        userName: String,
        passWord: String
    });

    this.$createUserSchema = mongoose.model('UserAuth', UserAuth);
}


UserAuth.prototype.AllowToAccess = function (userData) {
    return new Promise((resolve, reject) => {

        var me = this;

        me.$createUserSchema.findOne({ userName: userData.userName, passWord: userData.password }, (err, doc) => {


            if (err) {

                return reject(err);
            }

            if (doc) {
                return resolve(true);
            }
            else
                return resolve(false);

        })

    })
}


UserAuth.prototype.CreateUser = function (userData) {

    return new Promise((resolve, reject) => {
        var me = this;



        var newUser = new me.$createUserSchema({ userName: userData.userName, passWord: userData.password });
        newUser.save(err => {

            if (err) {
                return reject(err);
            }

            return resolve(true);

        })

    })
}
module.exports = UserAuth;