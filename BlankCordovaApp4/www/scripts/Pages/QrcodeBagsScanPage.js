
$("#QrcodeBagsScanPage .ui-content #QrcodeScannerBtn")
    .click(function () {

        scannedBags = [];
        scanBag();
    });


$("#QrcodeBagsScanPage .ui-content #ShowSCannedItemsBtn")
    .click(function () {

        //alert(InitializeScannedBags(scannedBags));

        socket.emit("StoringScannedBag",
            InitializeScannedBags(scannedBags));


        socket.on("StoredScannedBag", (savedItems) => {

            if (!savedItems)
                swal("لايوجد جديد لحفظه ")
            else
                swal("You have Saved " + savedItems + " New ")

        })
    });

var scannedBags = [];

function scanBag() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                // In this case we only want to process QR Codes
                if (result.format == "QR_CODE") {
                    var value = result.text;
                    // This is the retrieved content of the qr code
                    saveBag(value).then(function () {
                        scanBag();
                    })

                } else {
                    alert("Sorry, only qr codes this time ;)");
                }
            } else {
                alert("The user has dismissed the scan");
            }
        },
        function (error) {

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
    );
}

function saveBag(value) {

    return new Promise((resolve, reject) => {

        if (scannedBags.indexOf(value) == -1) {


            scannedBags.push(value);

        }
        resolve();

    })
}


function ExtractScannedBagObj(ScannedString) {
    var splitedObj = ScannedString.trim().split("-");
    return {
        BagType: splitedObj[0],
        BagNumber: splitedObj[1]

    }
}




function InitializeScannedBags(scannedProductStrings) {

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