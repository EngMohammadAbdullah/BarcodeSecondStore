
//هذه الصفحة لإدارة و توليد الأرقام العشوائية للأكياس

function GetBagNumberFromServer(BagType) {

    return new Promise((resolve, reject) => {



        socket.emit("GenerateBagNumberFromServer", BagType);

        socket.on("GeneratingBagNumberFromServer", (bagNumber) => {

            if (bagNumber) {
                return resolve(bagNumber)
            } else
                return reject(null)

        })


    })
}


//هذه الصفحة لتوليد أزرار حسب الأنواع الموجودة للطباعة
function AddDynamicControls(divaName) {

    


    var element = $('<div class="ui-grid-b" style="height:90px"> </div>');

    //var elementa = $('<div  class="ui-grid-b" style="height:95px"></div>');

    //var elementb = $('<div  class="ui-grid-b" style="height:95px"></div>');

    //var elementc = $('<div  class="ui-grid-c" style="height:95px"></div>');

    GetAllTypeNamesFromServer().then((allTypes) => {

        if (allTypes) {

            for (var i = 0; i < allTypes.length; i++) {
                var e;
                var typeName = allTypes[i].pName.trim().toUpperCase();
                switch ((i + 1) % 3) {

                    case 1:
                        {
                            e = element.clone();

                            //  var ea = elementa.clone();
                            var aa = $(' <div id="' +
                                typeName + '" class="ui-block-a" style="height:100%"> <img is="dragable" src="images/open_box-64.png" style="width:60px; margin:5px 15px 5px 18px"> <h5  style="text-align:center; margin-top:-5px;">' + typeName + '</h5> </div>')
                                .clone();
                            aa.click(function () {
                                /* Act on the event */

                                socket.emit("GenerateBagNumberFromServer",
                                    $(this).attr("id"));

                                GetStringForPrinting($(this).attr("id"))
                                    .then(function (str) {

                                        cordova.plugins.printer.print(str, {
                                            printerId: "MG3600 series(192.168.0.206)",

                                        });
                                    });
                            });


                            //  ea.append(aa)


                            e.append(aa);
                        }
                        break;
                    case 2:
                        {


                            // var eb = elementb.clone();
                            var aa = $(' <div id="' +
                                typeName + '" class="ui-block-b" style="height:100%"> <img is="dragable" src="images/open_box-64.png" style="width:60px; margin:5px 15px 5px 18px"> <h5 is="gk-text" style="text-align:center; margin-top:-5px;">' +
                                typeName + '</h5> </div>')
                                .clone();

                            aa.click(function () {

                                socket.emit("GenerateBagNumberFromServer",
                                    $(this).attr("id"));
                                GetStringForPrinting($(this).attr("id"))
                                    .then(function (str) {

                                        //cordova.plugins.printer.print(str);
                                        cordova.plugins.printer.print(str, {
                                            printerId: "MG3600 series(192.168.0.206)",

                                        });


                                    });
                            });
                            //  eb.append(aa)


                            e.append(aa);
                        }
                        break;
                    case 0:
                        {
                            // var ec = elementc.clone();
                            var aa = $(' <div id="' +
                                typeName + '" class="ui-block-c" style="height:100%"> <img is="dragable" src="images/open_box-64.png" style="width:60px; margin:5px 15px 5px 18px"> <h5 is="gk-text" style="text-align:center; margin-top:-5px;">' +
                                typeName + '</h5> </div>')
                                .clone();

                            aa.click(function () {
                                socket.emit("GenerateBagNumberFromServer",
                                    $(this).attr("id"));
                                GetStringForPrinting($(this).attr("id"))
                                    .then(function (str) {

                                        //cordova.plugins.printer.print(str);
                                        cordova.plugins.printer.print(str, {
                                            printerId: "MG3600 series(192.168.0.206)",

                                        });


                                    });
                            });
                            // ec.append(aa)
                            e.append(aa);

                        }
                        break;
                }//End Of Switch


                $("#" + divaName).append($("<br/>"));
                $("#" + divaName).append(e);


            }

        }
        else
            alert("حدص خطأ في استعادة البيانات");

    })


}//enf of the AddDynamicControls


//استعادة رقم من السيرفر  للطباعة
function GetStringForPrinting(qrCodeString) {

    return new Promise(function (resolve, reject) {
        try {
            socket.on("GeneratingBagNumberFromServer",
                function (productNumber) {
                    swal(productNumber);
                    qrcode.makeCode(productNumber);

                    $("#qrcode img").load(function () {
                        var uu = $("#qrcode img");
                        var imgstr = '<br /> <img src="' + uu.attr("src")
                            + '" alt="Alternate Text" />';
                        //$("#ttee").append(imgstr);
                        var documentToPrint =
                            '<html xmlns="http://www.w3.org/1999/xhtml"><head> <title></title> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width,maximum-scale=1.0"> <style type="text/css" media="screen"></style> <style type="text/css" media="print"></style>  <style> body { margin: 0; padding: 0; background-color: #FAFAFA; font: 12pt "Tahoma"; } * { box-sizing: border-box; -moz-box-sizing: border-box; } @page { size: 10cm 15cm; margin: 0; } @media print { .page { margin: 0; border: initial; border-radius: initial; width: initial; min-height: initial; box-shadow: initial; background: initial; } .subpage { border: 0px #fff solid; height: 140mm; font-size: 24px; margin-left: 2cm; margin-top: 0; padding-bottom: 30px; } h2 { margin: 0; margin-left:1.5cm } } </style>  </head><body> <div class="book"> <div class="page"> <div class="subpage" id="rrr"> <h2>' + productNumber + '</h2> <br />' + imgstr + '</div> </div> </div></body></html>';

                        resolve(documentToPrint);
                    });
                });

        } catch (e) {
            navigator.notification.alert(e.message)
        }
    })

}


function GetAllTypeNamesFromServer() {
    return new Promise((resolve, reject) => {
        socket.emit("GetAllProductTypes");
        socket.on("GettingAllProductTypes", (types) => {

            if (types) {
                return resolve(types);
            }
            else return resolve(null)
        })
    })
}


//Init QrCode
function InitQrCodeObject() {

    return new Promise(function (resolve, reject) {
        try {

            var qObject = {

                text: "http://jindo.dev.naver.com/collie",
                width: 180,
                height: 180,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H

            };

            $("#ttee").append('<div id="qrcode"></div>');

            $("#qrcode").hide();
            var qrcode = new QRCode("qrcode", {

                text: "http://jindo.dev.naver.com/collie",
                width: 180,
                height: 180,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H

            });
            resolve(qrcode);
        } catch (e) {
            navigator.notification.alert(e.message)
        }
    })

}

AddDynamicControls("BagsPageMain");


InitQrCodeObject().then(function (qrObj) {
    qrcode = qrObj;
    qrcode.makeCode("http://www.facebook.com");
});


$("#goToQrcodePage").click(function () {
    GetBagNumberFromServer("ccr").then((no) => {

        alert(no);

    })
    $.mobile.navigate("#BagsPage");
})

