try {
    (function () {
        "use strict";
        var alltypes = ["ccr", "cch", "mcp", "rrt", "lcp", "eer", "yyt", "upl"];
        var allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var qrcode = {};
        var centerDatabase = {};
        var ProductsDictionary = {};
        var socket = io.connect("http://192.168.0.154:3000");
        var nowMoment = new moment();
        document.addEventListener('deviceready', onDeviceReady.bind(this), false);

        function onDeviceReady() {

            try {

                //socket.on('connect', function () {
                //    if (socket.connected) {
                //        alert("connected");
                //    } else
                //        alert("Not connected");

                //});


                AddScriptTagToHead("scripts/Pages/GlobalVariables.js")
                AddScriptTagToHead("scripts/Pages/ProductTypesManagePageScript.js")
                AddScriptTagToHead("scripts/Pages/BagsPage.js")
                AddScriptTagToHead("scripts/Pages/ProductTypesPage.js")
                AddScriptTagToHead("scripts/Pages/TypeSearchImagesEvents.js")
                AddScriptTagToHead("scripts/Pages/QrcodeProductsScanPage.js")
                AddScriptTagToHead("scripts/Pages/QrcodeBagsScanPage.js")
                AddScriptTagToHead("scripts/Pages/OpenCloseContainerPage.js")
                AddScriptTagToHead("scripts/Pages/ProductDegreeManagePage.js")
                AddScriptTagToHead("scripts/Pages/verkochtBagsPage.js")
                AddScriptTagToHead("scripts/Pages/MainPage.js")
                AddScriptTagToHead("scripts/Pages/PrintContainerReport.js")


                //هذا التابع لاستيراد الأنواع من قاعدة البيانات 
                //CCR-CCH-MCP-.... 
                //و عرضعا في List view
                GetAllProductTypes();

                $("#GoToProductTypesPage").click(() => {
                    GetAllProductTypes();
                    $.mobile.navigate("#ProductTypesManagePage");
                })

                //الكود التالي لاستيراد أرقام الكونتيرات التي تم العمل عليها 

                //  GetAllScannedContainerNumbers();


                $("#GoToAllScannedContainerNumberProductsPage").click(() => {
                    $.mobile.navigate("#AllScannedContainerNumberProductsPage");
                });

                /* 
                 Open/CloseContainerPage الكود التالي لصفحة الــ 
                 
                 */


                //end Socket

                /* 
               OpenCloseContainerPage نهاية ك الــ
               
               */

                $("#ScanQrCodeToLogin").click(function () {

                    cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
                        if (enabled) {
                            initMap();
                        }
                        else {

                            swal("Please Enable Gps");
                        }
                    }, function (error) {
                        swal("The following error occurred: " + error);
                    });


                });




                //initMap();

                //Test Socket.io
                socket.on('news', function (data) {
                    swal(data);
                });

                socket.emit("Server", "Barcode Test!!");


                //End of socket.io
                socket.on('news', function (data) {
                    swal(data);
                });


                AddDynamicControls();
                InitQrCodeObject().then(function (qrObj) {
                    qrcode = qrObj;
                    qrcode.makeCode("http://www.facebook.com");
                });


                $("#qrcode img").load(function () {
                    $("#ttee .testimg").remove();
                    var uu = $("#qrcode img");
                    var imgstr = '<img  class="testimg" src="' + uu.attr("src")
                        + '" alt="Alternate Text" />';
                    $("#ttee").append(imgstr);


                });

                openDatabase().then(function () {

                    //var product = {};
                    //product.productType = "CCR";
                    //product.productNumber = "123456";
                    //product.containerID = "11";
                    //AddProduct(product)
                    //    .then(GetProducts)
                    //    .then(function (product) {
                    //        createProductsList(product);
                    //        $("#clistNumber").val(product.length);
                    //        $("#clistNumber").append('<span>' + product.length + '</span >')
                    //    })

                    // لا أعرف ماذا يعمل هذا الكود ؟؟
                    //هذا فقط يختبر الطباعة 
                    $("#printButton").click(function () {

                        var dd = $('<html xmlns="http://www.w3.org/1999/xhtml"><head> <title></title> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width,maximum-scale=1.0"> <style type="text/css" media="screen"></style> <style type="text/css" media="print"></style> <style> body { margin: 0; padding: 0; background-color: #FAFAFA; font: 12pt "Tahoma"; } * { box-sizing: border-box; -moz-box-sizing: border-box; } .page { width: 10cm; max-height: 15cm; border: 1px #D3D3D3 solid; border-radius: 5px; background: white; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); } .subpage { border: 5px red solid; height: 150mm; padding: 2cm; font-size:40px; } @page { size: 10cm 15cm; margin: 0; } @media print { .page { margin: 0; border: initial; border-radius: initial; width: initial; min-height: initial; box-shadow: initial; background: initial; page-break-after: always; } } </style></head><body> <div class="book"> <div class="page"> <div class="subpage" id="rrr"></div> </div> </div></body></html>');

                        var divPage = dd.getElementById("rrr");
                        divPage.text("HHHHHHH");

                        //cordova.plugins.printer.print(dd, { duplex: 'long' }, function (res) {
                        //    swal(res ? 'Done' : 'Canceled');
                        //});

                        cordova.plugins.printer.print(dd, {
                            printerId: "MG3600 series(192.168.0.206)",

                        });


                    });

                    //هنا يجب إعادة تنفيذه 

                    //GetGroupedProducts().then(function (gProducts) {
                    //    createGroupedProductsList(gProducts);
                    //    $("#clistNumber").append('<span>' + gProducts.length + '</span >')
                    //});


                }) //End of   openDatabase()


                //لا أعلم ماهذا التابع ؟؟؟
                // myfunction();


                // لا أعرف ماذا يعمل هذا الكود ؟؟


                //هذا فقط يختبر الطباعة 
                $("#printButton2").click(function () {

                    var elText = $("#textQrocode");

                    var dd =
                        '<html xmlns="http://www.w3.org/1999/xhtml"><head> <title></title> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width,maximum-scale=1.0"> <style type="text/css" media="screen"></style> <style type="text/css" media="print"></style> <style> body { margin: 0; padding: 0; background-color: #FAFAFA; font: 12pt "Tahoma"; } * { box-sizing: border-box; -moz-box-sizing: border-box; } .page { width: 10cm; max-height: 15cm; border: 1px #D3D3D3 solid; border-radius: 5px; background: white; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); } .subpage { border: 5px red solid; height: 150mm; padding: 2cm; font-size:40px; } @page { size: 10cm 15cm; margin: 0; } @media print { .page { margin: 0; border: initial; border-radius: initial; width: initial; min-height: initial; box-shadow: initial; background: initial; page-break-after: always; } } </style></head><body> <div class="book"> <div class="page"> <div class="subpage" id="rrr">' + + '</div> </div> </div></body></html>';



                    cordova.plugins.printer.print(dd, { printerId: "Save as PDF" });



                });

            } catch (e) {
                swal(e.message)
            }

        }; //End Of OnDeviceReady



        //Add <script tag > to Head Document
        function AddScriptTagToHead(src) {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = src;
            $("head").append(s);
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

        //start of Scanned 

        // End of Scanned Methods




        //الحصول على أنواع المنتجات CCR,MCP,Lpt
        function GetAllProductTypes() {

            socket.emit("GetAllProductTypes");

            socket.on("GettingAllProductTypes", (allTypes) => {

                if (allTypes.length) {
                    var listview = $("#listviewTypes");
                    listview.empty();

                    for (var i = 0; i < allTypes.length; i++) {

                        var theme = isEven(i) ? '"a"' : '"b"';
                        listview.append(' <li data-theme=' + theme +
                            'data-number="' + allTypes[i].pNumber + '" > <a href="#"> <img src="http://jqmdesigner.appspot.com/images/image.png" class="ui-li-icon">'
                            + allTypes[i].pName + '       '
                            + '</a> </li>')
                    }

                    $('[data-role=listview]').fieldset().fieldset('refresh');
                }
                else
                    swal("لايوجد أنواع لعرضها")

            })
        }



        //هذا استخدم لتسجيل الدخول 
        function ScanToLogin() {

            return new Promise((resolve, reject) => {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled) {
                            // In this case we only want to process QR Codes
                            if (result.format == "QR_CODE") {
                                resolve(result.text);
                            } else {

                                swal("Sorry, only qr codes this time ;)");
                            }
                        } else {
                            swal("The user has dismissed the scan");
                        }
                    },
                    function (error) {
                        reject(error);
                        swal(error.message);
                    }
                );

            });




        }

        //هذه الصفحة لتوليد أزرار حسب الأنواع الموجودة للطباعة
        function AddDynamicControls() {


            var element = $('<div class="ui-grid-b" style="height:55px"> </div>');

            var elementa = $('<div class="ui-block-a" style="height:100%"></div>');

            var elementb = $('<div class="ui-block-b" style="height:100%"></div>');

            var elementc = $('<div class="ui-block-c" style="height:100%"></div>');


            for (var i = 0; i < alltypes.length; i++) {
                var e;
                switch ((i + 1) % 3) {

                    case 1:
                        {
                            e = element.clone();
                            var ea = elementa.clone();
                            var aa = $('<a class="ui-btn  ui-btn-b">' +
                                alltypes[i] + '</a>').clone();

                            aa.click(function () {
                                /* Act on the event */

                                socket.emit("GetProductNumber", $(this).text());

                                GetStringForPrinting($(this).text())
                                    .then(function (str) {

                                        cordova.plugins.printer.print(str, {
                                            printerId: "MG3600 series(192.168.0.206)",

                                        });


                                    });



                            });

                            ea.append(aa)


                            e.append(ea);
                        }
                        break;
                    case 2:
                        {
                            var eb = elementb.clone();
                            var aa = $('<a class="ui-btn  ui-btn-b">' + alltypes[i] + '</a>').clone();

                            aa.click(function () {
                                GetStringForPrinting($(this).text())
                                    .then(function (str) {

                                        //cordova.plugins.printer.print(str);
                                        cordova.plugins.printer.print(str, {
                                            printerId: "MG3600 series(192.168.0.206)",

                                        });


                                    });
                            });
                            eb.append(aa)


                            e.append(eb);
                        }
                        break;
                    case 0:
                        {
                            var ec = elementc.clone();
                            var aa = $('<a class="ui-btn  ui-btn-b">' + alltypes[i] + '</a>').clone();

                            aa.click(function () {
                                GetStringForPrinting($(this).text())
                                    .then(function (str) {

                                        //cordova.plugins.printer.print(str);
                                        cordova.plugins.printer.print(str, {
                                            printerId: "MG3600 series(192.168.0.206)",

                                        });


                                    });
                            });
                            ec.append(aa)
                            e.append(ec);



                        }
                        break;
                }//End Of Switch


                $("#testDiv").append($("<br/>"));
                $("#testDiv").append(e);


            }



        }//enf of the AddDynamicControls


        //استعادة رقم من السيرفر  للطباعة 
        function GetStringForPrinting(qrCodeString) {

            return new Promise(function (resolve, reject) {
                try {

                    socket.on("SetProductNumber",
                        function (productNumber) {

                            swal(productNumber);
                            qrcode.makeCode(productNumber);

                            $("#qrcode img").load(function () {
                                var uu = $("#qrcode img");
                                var imgstr = '<br /> <img src="' + uu.attr("src")
                                    + '" alt="Alternate Text" />';
                                //$("#ttee").append(imgstr);
                                var documentToPrint = '<html xmlns="http://www.w3.org/1999/xhtml"><head> <title></title> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width,maximum-scale=1.0"> <style type="text/css" media="screen"></style> <style type="text/css" media="print"></style>  <style> body { margin: 0; padding: 0; background-color: #FAFAFA; font: 12pt "Tahoma"; } * { box-sizing: border-box; -moz-box-sizing: border-box; } @page { size: 10cm 15cm; margin: 0; } @media print { .page { margin: 0; border: initial; border-radius: initial; width: initial; min-height: initial; box-shadow: initial; background: initial; } .subpage { border: 0px #fff solid; height: 140mm; font-size: 24px; margin-left: 2cm; margin-top: 0; padding-bottom: 30px; } h2 { margin: 0; margin-left:1.5cm } } </style>  </head><body> <div class="book"> <div class="page"> <div class="subpage" id="rrr"> <h2>' + productNumber + '</h2> <br />' + imgstr + '</div> </div> </div></body></html>';

                                resolve(documentToPrint);


                            });

                        });


                } catch (e) {
                    navigator.notification.alert(e.message)
                }
            })

        }

        //لاختبار زوجي
        function isEven(n) {
            n = Number(n);
            return n === 0 || !!(n && !(n % 2));
        }




    })();

} catch (e) {
    alert(e.message);
}


// statements
