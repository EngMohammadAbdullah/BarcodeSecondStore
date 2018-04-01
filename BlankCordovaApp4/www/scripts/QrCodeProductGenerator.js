
//var qrcode = new QRCode("qrcode", {

//    text: QrcodeObject.text,
//    width: QrcodeObject.width,
//    height: QrcodeObject.height,
//    colorDark: QrcodeObject.colorDark,
//    colorLight: QrcodeObject.colorLight,
//    correctLevel: QRCode.CorrectLevel.H

//});

function GenerateProductQrCode(qrCodeText) {
    return new Promise(function (resolve, reject) {
        try {





            function makeCode() {


                qrcode.makeCode(qrCodeText);
                resolve();
            }



            makeCode();

            //$("#textQrocode").
            //    on("blur", function () {
            //        makeCode();
            //    }).
            //    on("keydown", function (e) {
            //        if (e.keyCode == 13) {
            //            makeCode();
            //        }
            //    });


        } catch (e) {
            navigator.notification.alert(e.message)
        }
    })
}
