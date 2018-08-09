
$("#QrcodeScannerBtn").click(function () {
    scannedItems = [];
    scan();
});

$("#ShowSCannedItemsBtn").click(function () {

    var containerNumber =    ExtractContainerNumber(scannedItems[ContainerIndexInfo]);

    socket.emit("StoreScannedProduct",
        InitializeScannedProducts(scannedItems), containerNumber);


    socket.on("ScanedProductsStored", (newStoredProducts) => {
        if (!newStoredProducts) {
            swal("لا يوجد جديد لتخزينه !!")

        }
        else

            swal(" تم تخزين " + newStoredProducts + " عنصر جديد ")

    })
});

var scannedItems = [];
const ContainerIndexInfo = 0;

function scan() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                // In this case we only want to process QR Codes
                if (result.format == "QR_CODE") {
                    var value = result.text;
                    // This is the retrieved content of the qr code
                    saveItem(value).then(function () {
                        scan();
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

function saveItem(value) {

    return new Promise((resolve, reject) => {

        if (scannedItems.indexOf(value) == -1) {


            scannedItems.push(value);

        }
        resolve();

    })
}

function ExtractScannedProductObj(ScannedString) {
    var splitedObj = ScannedString.trim().split("-");
    return {
        productType: splitedObj[0],
        productNumber: splitedObj[2]

    }
}


function ExtractContainerNumber(ScannedString) {

    return ScannedString.split("-")[1];
}


function InitializeScannedProducts(scannedProductStrings) {

    var scannedProducts = [];
    var productsNumbers = [];


    for (var i = 0; i < scannedProductStrings.length; i++) {
        if (productsNumbers.indexOf(ExtractScannedProductObj(scannedProductStrings[i]).productNumber) == -1) {
            scannedProducts.push(ExtractScannedProductObj(scannedProductStrings[i]))
            productsNumbers.push(ExtractScannedProductObj(scannedProductStrings[i]).productNumber);
        }
    }


    return scannedProducts;

}