var BookIt = BookIt || {};


BookIt.SignInController = function () {
    this.$signInPage = null;
    this.$btnSubmit = null;
    this.$txtEmailAddress = null;
    this.$txtPassword = null;
    this.$chkKeepSignedIn = null;
    this.$ctnErr = null;
    this.mainMenuPageId = null;
    this.socket = null;
};


BookIt.SignInController.prototype.init = function () {
    this.$signInPage = $("#page-signin");
    this.mainMenuPageId = "#MainPage";
    this.$btnSubmit = $("#btn-submit", this.$signInPage);
    this.$ctnErr = $("#ctn-err", this.$signInPage);
    this.$txtEmailAddress = $("#txt-email-address", this.$signInPage);
    this.$txtPassword = $("#txt-password", this.$signInPage);
    this.$chkKeepSignedIn = $("#chk-keep-signed-in", this.$signInPage);
};

BookIt.SignInController.prototype.emailAddressIsValid = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


BookIt.SignInController.prototype.resetSignInForm = function () {
    var invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";
    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);


    this.$txtEmailAddress.removeClass(invalidInputStyle);
    this.$txtPassword.removeClass(invalidInputStyle);
    this.$txtEmailAddress.val("");
    this.$txtPassword.val("");
    this.$chkKeepSignedIn.prop("checked", false);
};



BookIt.SignInController.prototype.onSignInCommand = function () {
    var me = this,
        emailAddress = me.$txtEmailAddress.val().trim(),
        password = me.$txtPassword.val().trim(),
        invalidInput = false,
        invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";
    // Reset styles.
    me.$ctnErr.removeClass().addClass(invisibleStyle);
    me.$txtEmailAddress.removeClass(invalidInputStyle);
    me.$txtPassword.removeClass(invalidInputStyle);
    // Flag each invalid field.
    if (emailAddress.length === 0) {
        me.$txtEmailAddress.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (password.length === 0) {
        me.$txtPassword.addClass(invalidInputStyle);
        invalidInput = true;
    }
    // Make sure that all the required fields have values.
    if (invalidInput) {
        me.$ctnErr.html("<p>Please enter all the required fields.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        return;
    }


    //if (!me.emailAddressIsValid(emailAddress)) {
    //    me.$ctnErr.html("<p>Please enter a valid email address.</p>");
    //    me.$ctnErr.addClass("bi-ctn-err").slideDown();
    //    me.$txtEmailAddress.addClass(invalidInputStyle);
    //    return;
    //}

    //setTimeout(function () {
    //    $.mobile.loading('show');
    //}, 5000);

    var userData = {

        userName: emailAddress,
        password: password

    }



    try {
        socket.emit("UserAuthentication", userData);
        socket.on("IsValidUser", (isValid) => {
           
                if (isValid == true) {
                    // Create session. 
                    var today = new Date();
                    var expirationDate = new Date();
                    expirationDate.setTime(today.getTime() + 900000);
                    BookIt.Session.getInstance().set({
                        expirationDate: expirationDate,
                        keepSignedIn: me.$chkKeepSignedIn.is(":checked")
                    });
                    // Go to main menu.
                    $.mobile.navigate(me.mainMenuPageId);
                    return;
                }
                
         
        })
    } catch (e) {
        alert(e.message);
    }



};









































































