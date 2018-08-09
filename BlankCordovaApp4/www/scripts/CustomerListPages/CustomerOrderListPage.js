var customerOrderList = customerOrderList || {};

customerOrderList = function () {
    this.$customerOrderPage = null;
    this.$user = null;
    this.$ctnErr = null;
    this.$btnSubmit = null;
    this.$CustomersList = null;
    this.$CustomerOrderBagsList = null;
    this.$filterTextBox = null;
    this.$selectedUser = null;
    this.socket = null;
    this.BagsOrder = null;
    //this.saveBag = null;
    //this.scanBag = null;
    this.$scanCustomerBag = null;


};

customerOrderList.prototype.init = function () {
    var me = this;
    this.$customerOrderPage = $("#CustomerOrderList");
    this.$user = $("#txt-user-Name", this.$customerOrderPage);
    this.$btnSubmit = $("#btn-User-submit", this.$customerOrderPage);
    this.$ctnErr = $("#ctn-err", this.$customerOrderPage);
    this.$CustomersList = $("#CustomersList", this.$customerOrderPage);
    this.$filterTextBox = $("input[data-type~='search']", this.$customerOrderPage);
    this.$selectedUser = $("#selectedCustomer", this.$customerOrderPage);
    this.$CustomerOrderBagsList = $("#CustomerOrderBagsList", this.$customerOrderPage);
    this.BagsOrder = [];
    // this.$exitScan = false;


    this.$scanCustomerBag = $("#scanCustomerBag", this.$customerOrderPage);



    this.$scanCustomerBag.off().on("click", () => {
        try {
            me.restVars();
            me.scanBags();


        } catch (e) {

        }
    });


}


customerOrderList.prototype.restVars = function () {

    this.BagsOrder = [];
    this.$CustomerOrderBagsList.empty();

}


customerOrderList.prototype.SearchUser = function (userData) {
    var me = this,
        searchBox = me.$filterTextBox,
        customerList = me.$CustomersList,
        selectedUserHeader = me.$selectedUser;

    setTimeout(function () {
        $.mobile.loading('show');
    }, 1);

    if (!(searchBox.val().trim().length)) {
        setTimeout(function () {
            $.mobile.loading('hide');
        }, 100);
        customerList.empty();
        customerList.listview().listview('refresh');
        return;
    }

    if (searchBox.val().trim().length > 2) {

        socket.emit("findingCustomer", searchBox.val().trim());

        socket.on("FoundedCustomer", (foundedCustomers) => {

            customerList.empty();

            if (foundedCustomers.length) {

                for (var i = 0; i < foundedCustomers.length; i++) {
                    customerList.append('<li  is="listview-li"> <a  > ' +
                        foundedCustomers[i].userName + "  " + foundedCustomers[i].familyName +
                        ' <br />' + foundedCustomers[i].PhoneNo + ' <br />' + foundedCustomers[i].emailAddress +
                        ' </a > </li > ');
                }
                $('li a', customerList).off('click');
                $('li a', customerList).on('click', function () {
                    var ul = $(this);
                    var styles = {
                        "border-radius": "15px 0 15px 0",
                        "font-family": "'Libre Baskerville', serif",
                        "font-size": "18px",
                        "border-bottom": ".5px solid #0255d8",
                        "background-color": "rgb(102,45,145)",
                        "color": "#fff",
                        "padding": "10px",
                        "padding-left": "20px"

                    };
                    selectedUserHeader.html(ul.html()).css(styles);
                    selectedUserHeader.off();
                    selectedUserHeader.on("swipeleft", function () {
                        selectedUserHeader.text("");
                        selectedUserHeader.removeAttr("style");

                    });
                    selectedUserHeader.on("swiperight", function () {
                        alert($(this).text());
                    });

                });

                customerList.listview().listview('refresh');

            }
            else {
                customerList.empty();
                customerList.listview().listview('refresh');
            }

        })
        setTimeout(function () {
            $.mobile.loading('hide');
        }, 100);
    }
}


customerOrderList.prototype.ScanOrderBags = function () {

    var me = this,
        bagsOrder = me.BagsOrder,
        bagsOrderList = me.$CustomerOrderBagsList,
        selectedUser = me.$selectedUser,
        invalidInput = false,
        scanBtn = me.$customerOrderPage;


    if (selectedUser.text().length == 0) {
        invalidInput = true;
    }

    if (invalidInput) {
        swal("يجب اختيار زبون ")
        return;
    }
}



customerOrderList.prototype.resetcustomerList = function () {

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



customerOrderList.prototype.scanBags = function () {
    var me = this;
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                // In this case we only want to process QR Codes
                if (result.format == "QR_CODE") {
                    var value = result.text;
                    // This is the retrieved content of the qr code
                    me.saveBag(value).then(function () {
                        me.scanBags();
                    })
                } else {
                    alert("Sorry, only qr codes this time ;)");
                }
            } else {
                //alert("Coreee");
                me.InsertProduct();
            }
        },
        function (error) {
            alert("خطأ");
        },
        {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: true, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt: "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations: false, // iOS
            disableSuccessBeep: true // iOS and Android
        }
    )
}


customerOrderList.prototype.saveBag = function (value) {
    var me = this;
    return new Promise((resolve, reject) => {

        if (me.BagsOrder) {
            if (me.BagsOrder.indexOf(value) == -1) {
                me.BagsOrder.push(value);
            }
            resolve();
        } else
            resolve();
    })
};


customerOrderList.prototype.InsertProduct = function () {


    var me = this,
        listBag = me.$CustomerOrderBagsList,
        ExtractScannedBagObj = function ExtractScannedBagObj(ScannedString) {
            var splitedObj = ScannedString.trim().split("-");
            return {
                BagType: splitedObj[0],
                BagNumber: splitedObj[1]

            }
        },
        InitializeScannedBags = function (scannedProductStrings) {

            var scannedBags = [];
            var productsNumbers = [];

            for (var i = 0; i < scannedProductStrings.length; i++) {
                var temp = ExtractScannedBagObj(scannedProductStrings[i]);
                if (productsNumbers.indexOf(temp.BagNumber) == -1) {
                    scannedBags.push(temp)
                    productsNumbers.push(temp.BagNumber);
                }
            }
            return scannedBags;
        }

    var list = InitializeScannedBags(me.BagsOrder);

    for (var i = 0; i < list.length; i++) {

        listBag.append('<li is="listview-li"> <a href="#"> <img src="http://jqmdesigner.appspot.com/images/image.png" class>' +
            list[i].BagType + '  ' + list[i].BagNumber + '</a> </li>')
        
    }

    listBag.listview().listview('refresh');

    return resolve(true);
}


//customerOrderList.prototype.OnNewCustomerCreated = function () {

//    var me = this,
//        userName = me.$userName.val().trim(),
//        userFamilyName = me.$userLastname.val().trim(),
//        userPhoneNo = me.$userPhoneNo.val().trim(),
//        userEmailAddress = me.$userEmailAddress.val().trim(),
//        invisibleStyle = "bi-invisible",
//        invalidInputStyle = "bi-invalid-input",
//        invalidInput = false;

//    me.$ctnErr.removeClass().addClass(invisibleStyle);
//    me.$userName.removeClass(invalidInputStyle);
//    me.$userLastname.removeClass(invalidInputStyle);
//    me.$userPhoneNo.removeClass(invalidInputStyle);
//    me.$userEmailAddress.removeClass(invalidInputStyle);



//    if (userName.length == 0) {
//        me.$userName.addClass(invalidInputStyle);
//        invalidInput = true;
//    }

//    if (userFamilyName.length == 0) {
//        me.$userLastname.addClass(invalidInputStyle);
//        invalidInput = true;
//    }
//    if (userPhoneNo.length == 0) {
//        me.$userPhoneNo.addClass(invalidInputStyle);
//        invalidInput = true;
//    }

//    if (userEmailAddress.length == 0) {
//        me.$userEmailAddress.addClass(invalidInputStyle);
//        invalidInput = true;
//    }

//    // Make sure that all the required fields have values.
//    if (invalidInput) {
//        me.$ctnErr.html("<p>Please enter all the required fields.</p>");
//        me.$ctnErr.addClass("bi-ctn-err").slideDown();
//        return;
//    }

//    if (!me.emailAddressIsValid(userEmailAddress)) {
//        me.$ctnErr.html("<p>Please enter a valid email address.</p>");
//        me.$ctnErr.addClass("bi-ctn-err").slideDown();
//        me.$userEmailAddress.addClass(invalidInputStyle);
//        return;
//    }

//    var userData = {
//        userName: userName,
//        familyName: userFamilyName,
//        PhoneNo: userPhoneNo,
//        emailAddress: userEmailAddress

//    }

//    socket.emit("CreatingCustomer", userData);

//    socket.on("CreatedCustomer", (status) => {
//        let timerInterval
//        if (status) {
//            me.resetcustomerList();

//            swal({
//                html: 'تم إنشاء الزبون',
//                timer: 2000,
//                type: 'success',
//                onClose: () => {
//                    clearInterval(timerInterval)
//                }
//            })

//        }
//        else
//            swal({
//                html: 'لم يتم إنشاء الزبون ',
//                timer: 2000,
//                type: 'error',
//                onClose: () => {
//                    clearInterval(timerInterval)
//                }
//            })


//    })



//}