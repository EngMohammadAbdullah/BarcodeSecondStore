var customerList = customerList || {};

customerList = function () {
    this.$customerPage = null;
    this.$userName = null;
    this.$userLastname = null;
    this.$userPhoneNo = null;
    this.$userEmailAddress = null;
    this.$ctnErr = null;
    this.$btnSubmit = null;
    this.socket = null;
};

customerList.prototype.init = function () {

    this.$customerPage = $("#CustomerList");
    this.$userName = $("#txt-user-Name", this.$customerPage);
    this.$userLastname = $("#txt-user-fName", this.$customerPage);
    this.$userPhoneNo = $("#txt-PhoneNo", this.$customerPage);
    this.$userEmailAddress = $("#txt-uemail-address", this.$customerPage);
    this.$btnSubmit = $("#btn-User-submit", this.$customerPage);
    this.$ctnErr = $("#ctn-err", this.$signInPage);
}




customerList.prototype.emailAddressIsValid = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

customerList.prototype.resetcustomerList = function () {

    var invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";
    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);

    this.$userName.removeClass(invalidInputStyle);
    this.$userLastname.removeClass(invalidInputStyle);
    this.$userPhoneNo.removeClass(invalidInputStyle);
    this.$userEmailAddress.removeClass(invalidInputStyle);


    this.$userName.val("");
    this.$userLastname.val("");
    this.$userPhoneNo.val("");
    this.$userEmailAddress.val("");


};


customerList.prototype.OnNewCustomerCreated = function () {

    var me = this,
        userName = me.$userName.val().trim(),
        userFamilyName = me.$userLastname.val().trim(),
        userPhoneNo = me.$userPhoneNo.val().trim(),
        userEmailAddress = me.$userEmailAddress.val().trim(),
        invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input",
        invalidInput = false;

    me.$ctnErr.removeClass().addClass(invisibleStyle);
    me.$userName.removeClass(invalidInputStyle);
    me.$userLastname.removeClass(invalidInputStyle);
    me.$userPhoneNo.removeClass(invalidInputStyle);
    me.$userEmailAddress.removeClass(invalidInputStyle);



    if (userName.length == 0) {
        me.$userName.addClass(invalidInputStyle);
        invalidInput = true;
    }

    if (userFamilyName.length == 0) {
        me.$userLastname.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (userPhoneNo.length == 0) {
        me.$userPhoneNo.addClass(invalidInputStyle);
        invalidInput = true;
    }

    if (userEmailAddress.length == 0) {
        me.$userEmailAddress.addClass(invalidInputStyle);
        invalidInput = true;
    }

    // Make sure that all the required fields have values.
    if (invalidInput) {
        me.$ctnErr.html("<p>Please enter all the required fields.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        return;
    }

    if (!me.emailAddressIsValid(userEmailAddress)) {
        me.$ctnErr.html("<p>Please enter a valid email address.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        me.$userEmailAddress.addClass(invalidInputStyle);
        return;
    }

    var userData = {
        userName: userName,
        familyName: userFamilyName,
        PhoneNo: userPhoneNo,
        emailAddress: userEmailAddress

    }

    socket.emit("CreatingCustomer", userData);

    socket.on("CreatedCustomer", (status) => {
        let timerInterval
        if (status) {
            me.resetcustomerList();

            swal({
                html: 'تم إنشاء الزبون',
                timer: 2000,
                type: 'success',
                onClose: () => {
                    clearInterval(timerInterval)
                }
            })

        }
        else
            swal({
                html: 'لم يتم إنشاء الزبون ',
                timer: 2000,
                type: 'error',
                onClose: () => {
                    clearInterval(timerInterval)
                }
            })


    })



}