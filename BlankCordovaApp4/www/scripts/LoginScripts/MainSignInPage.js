var app = {};
app.signInController = new BookIt.SignInController();
app.customerList = new customerList();
app.customerOrderList = new customerOrderList();


$(document).on("pagecontainerbeforeshow", function (event, ui) {

    if (typeof ui.toPage == "object") {
        switch (ui.toPage.attr("id")) {

            case "page-signin":

                // Reset signin form.
                app.signInController.resetSignInForm();
                break;


        }
    }
});


$(document).delegate("#page-signin", "pagebeforecreate", function () {

    app.signInController.init();

    app.signInController.$btnSubmit.off("tap").on("tap", function () {
        app.signInController.onSignInCommand();
    });

});

$(document).delegate("#CustomerList", "pagebeforecreate", function () {


    app.customerList.init();
    try {
        app.customerList.$btnSubmit.off().on("click", function () {
            app.customerList.OnNewCustomerCreated();
        });

    } catch (e) {
        alert(e.message);
    }

});


$(document).delegate("#CustomerOrderList", "pagebeforecreate", function () {

    app.customerOrderList.init();
    app.customerOrderList.$filterTextBox.on("input", function () {
        app.customerOrderList.SearchUser($(this).val().trim());
    })
});


//$(document).delegate("#CustomerOrderList", "pagebeforecreate", function () {


//    app.customerOrderList.init();
//    this.$filterTextBox.on('input', this.SearchUser);
//    try {
//        app.customerOrderList.$filterTextBox.off().on("input", function () {
//            alert("dd");
//        });

//    } catch (e) {
//        alert(e.message);
//    }

//});


$(document).on("pagecontainerbeforechange", function (event, ui) {

    if (typeof ui.toPage !== "object") return;

    // alert(ui.toPage.attr("id"));
    switch (ui.toPage.attr("id")) {
        case "page-signin":
            
            if (!ui.prevPage) {
                // Check session.keepSignedIn and redirect to main menu.
                var session = BookIt.Session.getInstance().get(),
                    today = new Date();


                //if (session.keepSignedIn &&
                //    new Date(session.expirationDate).getTime()
                //    > today.getTime()) {

                //    ui.toPage = $("#MainPage");
                //}
                if (session.keepSignedIn) {

                    ui.toPage = $("#MainPage");
                }
            }            


            break;
        case "CustomerList":

            app.customerList.resetcustomerList();
            // ui.toPage = $("#CustomerList");
            //  $.mobile.navigate("#CustomerList");
            break;



    }
});


//$(document).on("pagecontainerbeforechange", function (event, data) {

//    /* all properties shouldn't return "undefined" */
//    var toPage = data.toPage,
//        prevPage = data.prevPage ? data.prevPage : "",
//        options = data.options,
//        /* to determine which page (hash) the user is navigating to */
//        absUrl = data.absUrl ? $.mobile.path.parseUrl(data.absUrl).hash.split("#")[1] : "",
//        /* assuming the user is logged off */
//        userLogged = false;

//    //alert(toPage);

//    if (typeof toPage == "object" && absUrl == "page-signin") {
//        //data.prevPage.attr('id') == "page2"

//        data.toPage[0] = $("#MainPage")[0];

//        $.extend(data.options, {
//            transition: "flip",
//            changeHash: false
//        });
//    }

//});