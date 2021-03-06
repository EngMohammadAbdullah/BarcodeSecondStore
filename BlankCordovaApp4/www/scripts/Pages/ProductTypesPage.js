﻿
//هذه الصفحة لإدارة و توليد الأرقام العشوائية للبالات

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

    GetAllDegrees();
    var element =
        $('<div class="ui-grid-b" style="height:90px"> </div>');

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
                                typeName +
                                '" class="ui-block-a" style="height:100%"> <img is="dragable" src="images/open_box-64.png" style="width:60px; margin:5px 15px 5px 18px"> <h5  style="text-align:center; margin-top:-5px;">' + typeName + '</h5> </div>')
                                .clone();
                            aa.click(function () {
                                /* Act on the event */
                                var selectedDegree = checkSelectedDegree();
                                if (!selectedDegree) {
                                    swal("يحب اختيار نوع")
                                    return;
                                }
                                socket.emit("GenerateProductNumberFromServer",
                                    $(this).attr("id") + "_" + selectedDegree);

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

                                socket.emit("GenerateProductNumberFromServer",
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
                                socket.emit("GenerateProductNumberFromServer",
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



    });



}//enf of the AddDynamicControls

//Check If User have selected a degree 
function checkSelectedDegree() {
    return $("#ProductTypesPage #selectedDegreeHeader").text();
}

//استعادة رقم من السيرفر  للطباعة
function GetStringForPrinting(qrCodeString) {

    return new Promise(function (resolve, reject) {
        try {
            socket.on("GeneratingProductNumberFromServer",
                function (productNumber) {
                    // swal(productNumber);
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

// 
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

//Get AllDegrees From Server ex:Karatchi , Konakri,..
function GetAllDegrees() {
    socket.emit("GetAllProductDegrees");
    socket.on("GettingAllProductDegrees", (alldegrees) => {

        if (alldegrees.length) {

            $("#ProductDegreesMain").empty();
            var element =
                $('<div class="ui-grid-b" style="height:90px"> </div>');

            for (var i = 0; i < alldegrees.length; i++) {
                var e;
                var typeName =
                    alldegrees[i].shortcut.trim().toUpperCase();

                switch ((i + 1) % 3) {

                    case 1:
                        {
                            e = element.clone();
                            //  var ea = elementa.clone();
                            var aa = $(' <div id="' +
                                typeName +
                                '" class="ui-block-a" style="height:100%"> <h1  style="text-align:center;font-size:42px; margin-top:5px; ;text-align:center">' + typeName + '</h1> </div>')
                                .clone();

                            aa.click(function () {

                                $("#selectedDegreeHeader")
                                    .text($(this).attr("id"));
                                $("#ProductTypesPage div[class^='ui-block']")
                                    .css("color", "unset");
                                $(this).css({

                                    color: "red"
                                })

                            });

                            e.append(aa);
                        }
                        break;
                    case 2:
                        {


                            // var eb = elementb.clone();
                            var aa = $(' <div id="' +
                                typeName +
                                '" class="ui-block-b" style="height:100%"> <h1  style="text-align:center;font-size:42px; margin-top:5px; ;text-align:center">' + typeName + '</h1> </div>')
                                .clone();

                            aa.click(function () {
                                $("#selectedDegreeHeader")
                                    .text($(this).attr("id"));
                                $("#ProductTypesPage div[class^='ui-block']")
                                    .css("color", "unset");
                                $(this).css({

                                    color: "red"
                                })
                            });
                            //  eb.append(aa)


                            e.append(aa);
                        }
                        break;
                    case 0:
                        {
                            // var ec = elementc.clone();
                            var aa = $(' <div id="' +
                                typeName +
                                '" class="ui-block-c" style="height:100%"> <h1  style="text-align:center;font-size:42px; margin-top:5px; ;text-align:center">' + typeName + '</h1> </div>')
                                .clone();

                            aa.click(function () {
                                $("#selectedDegreeHeader")
                                    .text($(this).attr("id"));
                                $("#ProductTypesPage div[class^='ui-block']")
                                    .css("color", "unset");
                                $(this).css({

                                    color: "red"
                                })
                            });
                            // ec.append(aa)
                            e.append(aa);

                        }
                        break;
                }//End Of Switch


                $("#ProductDegreesMain").append($("<br/>"));
                $("#ProductDegreesMain").append(e);

            }



        }
    })


};

//Assign changed Event 
(function () {
    $("#ProductTypesPage input[type='radio']").bind("change", function (event, ui) {
        //  alert($(this).val());
        $("#selectedDegreeHeader").text($(this).val());
        $("#popupMenu").popup("close");
    });
})()

$(document).on('pageshow', '#ProductTypesPage', function () {
    AddDynamicControls("ProductTypesMain");

    (function () {


        $(document).delegate(".ui-content", "scrollstart", false);

        $("#ProductTypesSearch").on('input', function (e) {
            if ($(this).val().trim()) {
                $(".ui-grid-b").css("display", "none");
                var parent = $("#" + $(this).val().toUpperCase()).parent();
                parent.css("display", "initial");

                $("#" + $(this).val().toUpperCase())
                    .css("display", "initial");
                $('html, body').animate({
                    scrollTop: $("#" + $(this).val().toUpperCase()).offset().top + 100
                }, 700);

                // SearchType("BagsPageMain", $(this).val().trim().toUpperCase());
            }
            else {

                $(".ui-grid-b").css("display", "initial");
                //  AddDynamicControls("BagsPageMain");

            }

        });



        $(".ui-input-clear").on('click', function () {
            $(".ui-grid-b").css("display", "initial");
            $(".ui-grid-b div").css("display", "initial");

        });
        $(".ui-grid-b .ui-block-a").on("click", function () {
            alert($(this).attr("id"));
        })


    })()

    InitQrCodeObject().then(function (qrObj) {
        qrcode = qrObj;
        qrcode.makeCode("http://www.facebook.com");
    });



});

$("#goToQrcodePage").click(function () {
    GetBagNumberFromServer("ccr").then((no) => {

        alert(no);

    })
    $.mobile.navigate("#BagsPage");
})
