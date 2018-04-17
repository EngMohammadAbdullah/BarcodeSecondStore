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
            //هذا الحدث لإضافة نوع جديد للاثحة
            //يقوم بتوليد 
            $("#addProductType").click(() => {

                var myArr = $('#listviewTypes li');
                for (var i = 0; i < myArr.length; i++) {
                    if ($(myArr[i]).text().trim().toUpperCase() ==
                        $("#productTypeText").val().trim().toUpperCase()) {
                        alert("Type Exist");
                        return;
                    }
                }
                var listview = $("#listviewTypes");
                var pNumber = "";

                for (var i = 0; i < $("#productTypeText").val().length; i++) {
                    var temp = (allLetters.indexOf($("#productTypeText").val()[i].toUpperCase()) + 1);
                    pNumber += temp;
                }

                alert(pNumber);

                listview.append(

                    ' <li data-number="' + pNumber + '" > <a href="#"> <img src="http://jqmdesigner.appspot.com/images/image.png" class="ui-li-icon">'
                    + $("#productTypeText").val().trim().toUpperCase() + '</a> </li>')

                $('[data-role=listview]').listview().listview('refresh');


            })
            //لتخزين العناصر في الإنترنت 
            $("#StoreNewProductTypesInDB").click(() => {

                var allTypes = [];

                var allItems = $('#listviewTypes li');

                for (var i = 0; i < allItems.length; i++) {
                    var typeItem = {};
                    typeItem.pName = $(allItems[i]).text();
                    typeItem.pNumber = $(allItems[i]).attr("data-number");
                    allTypes.push(typeItem);
                }
                if (allTypes.length) {


                    socket.emit("StoreNewProductTypes", allTypes);
                }
                else
                    swal("لا يوجد أنواع جديدة لتخزينها ")

            })
            //هذا الحدث للذهاب لصفحة المنتجات 
            $("#GoToProductTypesPage").click(() => {
                GetAllProductTypes();
                $.mobile.navigate("#ProductTypesManagePage");
            })
            //  هذا التابع يطبع تقرير عن البالات التي تم تخزينها 
            PrintScannedProductReport()
            //الكود التالي لاستيراد أرقام الكونتيرات التي تم العمل عليها 

            //  GetAllScannedContainerNumbers();
            $("#GoToOpenCloseContainerPage").click(() => {
                $.mobile.navigate("#OpenCloseContainerPage");
            })

            $("#GoToAllScannedContainerNumberProductsPage").click(() => {
                $.mobile.navigate("#AllScannedContainerNumberProductsPage");
            });

            $(document).on('pageshow', '#OpenCloseContainerPage', function () {


                // Show full page LoadingOverlay
                $.LoadingOverlay("show");

                GetAllScannedContainerNumbers();
            });

            try {

                var openBtn = $("#openContainerScanDocument");
                var closeBtn = $("#closeContainerScanDocument");



                /* 
                 Open/CloseContainerPage الكود التالي لصفحة الــ 
                 
                 */

                openBtn.click(function () {


                    socket.emit("OpenScannedDocument");
                    //after Getting Object
                    socket.on("OpenedScannedDocument", (openedScannedDocument) => {

                        if (openedScannedDocument) {

                            swal({
                                title: 'Create Container',
                                text: 'Start to creating container',
                                timer: 4000,
                                onOpen: () => {
                                    swal.showLoading()
                                    $("#containerNoHeader").text(openedScannedDocument.container_number);
                                }
                            })
                        }

                    });

                });

                closeBtn.click(() => {
                    swal("Open document !!")
                    openBtn.enabled = false;

                });

                //Socket connection
                if (socket.connected) {
                    openBtn.removeClass('ui-disabled');
                }
                else {
                    openBtn.addClass('ui-disabled');
                }

                socket.on('connect', function () {
                    if (socket.connected) {
                        openBtn.removeClass('ui-disabled');
                    }

                });

                socket.on('disconnect', function () {
                    if (!socket.connected) {
                        openBtn.addClass('ui-disabled');
                    }


                });
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


            } catch (e) {
                swal(e.message);
            }

            try {

                $("#QrcodeScannerBtn").click(function () {

                    scan();

                });

                $("#ShowSCannedItemsBtn").click(function () {

                    navigator.notification.alert(scannedItems);
                    navigator.notification.alert(scannedItems.length);

                });
                //initMap();
            } catch (e) {
                swal(e.message);
            }

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

    var scannedItems = [];

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

            }
        );
    }

    function saveItem(value) {

        return new Promise((resolve, reject) => {

            scannedItems.push(value);
            resolve();

        })
    }

    // End of Scanned Methods


    //  هذا التابع يطبع تقرير عن البالات التي تم تخزينها 

    function PrintScannedProductReport() {

        $("#testPrintReport").click(() => {

            socket.emit("GellAllScannedProducts", "4546461");

            socket.on("GettingAllScannedContainerNumbers", (products) => {

                var tablestr = "";

                CountOf(products).then((objects) => {


                    for (var key in objects) {
                        var value = objects[key];
                        var element = "<tr><td>" + key +
                            "</td><td>" + value + "</td></tr>";

                        tablestr += element;
                    }



                    //for (var i = 0; i < CountOf(products).length; i++) {

                    //    var element = "<tr><td>" + products[i].productNumber +
                    //        "</td><td>" + products[i].productType + "</td></tr>";

                    //    tablestr += element;
                    //}


                    var str = '<!DOCTYPE html><html><head> <style> body { background: rgb(204,204,204); } page { background: white; display: block; margin: 0 auto; margin-bottom: 0.5cm; box-shadow: 0 0 0.5cm rgba(0,0,0,0.5); } page[size="A4"] { width: 21cm; height: 29.7cm; } page[size="A4"][layout="portrait"] { width: 29.7cm; height: 21cm; } page[size="A3"] { width: 29.7cm; height: 42cm; } page[size="A3"][layout="portrait"] { width: 42cm; height: 29.7cm; } page[size="A5"] { width: 14.8cm; height: 21cm; } page[size="A5"][layout="portrait"] { width: 21cm; height: 14.8cm; } @media print { body, page { margin: 0; box-shadow: 0; } } #customers { font-family: "Trebuchet MS", Arial, Helvetica, sans-serif; border-collapse: collapse; width: 100%; } #customers td, #customers th { border: 1px solid #ddd; padding: 8px; } #customers tr:nth-child(even) { background-color: #f2f2f2; } #customers tr:hover { background-color: #ddd; } #customers th { padding-top: 12px; padding-bottom: 12px; text-align: left; background-color: #4CAF50; color: white; } #customers th:first-of-type { width: 20% } </style></head><body> <page size="A4"> <table id="customers"> <tr> <th>Company</th> <th>Contact</th> </tr> '
                        + tablestr + '</table> </page></body></html>';



                    cordova.plugins.printer.print(str, {
                        printerId: "MG3600 series(192.168.0.206)",

                    });

                });


            });


        })
    }
    //الحصول على أنواع المنتجات CCR,MCP,Lpt
    function GetAllProductTypes() {

        socket.emit("GetAllProductTypes");
        socket.on("GettingAllProductTypes", (allTypes) => {

            if (allTypes.length) {
                alert(allTypes.length);
                var listview = $("#listviewTypes");
                listview.empty();

                for (var i = 0; i < allTypes.length; i++) {

                    var theme = isEven(i) ? '"a"' : '"b"';
                    listview.append(' <li data-theme=' + theme +
                        'data-number="' + allTypes[i].pNumber + '" > <a href="#"> <img src="http://jqmdesigner.appspot.com/images/image.png" class="ui-li-icon">'
                        + allTypes[i].pName + '       '
                        + '</a> </li>')
                }

                $('[data-role=listview]').listview().listview('refresh');
            }
            else
                swal("لايوجد أنواع لعرضها")

        })
    }

    function CountOf(products) {

        return new Promise((resolve, reject) => {
            //const vals = Object.keys(products).map(key => products[key]);
            //alert(vals.length);
            var elements = {};
            for (var i = 0; i < products.length; i++) {
                if (elements[products[i].productType] == undefined) {
                    elements[products[i].productType] = 1;
                }
                else
                    elements[products[i].productType] += 1;
            }

            return resolve(elements);
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

    //هذا الكود لاستيراد الكود من قاعدة البيانات و عرضه في ال Listview
    function GetAllScannedContainerNumbers() {



        socket.on("GettingAllScannedContainerNumbers",
            (_allScannedContainers) => {
                var listview = $("#listViewContainerNumbers");

                if (_allScannedContainers) {

                    listview.empty();
                    for (var i = 0; i < _allScannedContainers.length; i++) {

                        var theme = isEven(i) ? '"a"' : '"b"';
                        var liElement =
                            $('<li data-theme=' + theme + '> </li>');

                        liElement.append('<a href="#"> <img src="http://jqmdesigner.appspot.com/images/image.png" class="ui-li-icon">'
                            + _allScannedContainers[i] + '</a>');

                        liElement.click((e) => {

                            var txt = $(e.target).text();

                            GellAllScannedProduct(txt);
                            $.mobile.navigate("#AllScannedContainerNumberProductsPage");


                        });

                        listview.append(liElement);
                    }

                }
                else
                    listview.empty();
                $('[data-role=listview]').listview().listview('refresh');

            })
        $.LoadingOverlay("hide");
    }

    function GellAllScannedProduct(containerNumber) {

        socket.emit("GellAllScannedProducts", containerNumber);
        var listview = $("#listViewScannedProducts");
        socket.on("GettingAllScannedContainerNumbers", (_allScannedProducts) => {

            if (_allScannedProducts) {

                listview.empty();

                for (var i = 0; i < _allScannedProducts.length; i++) {

                    var theme = isEven(i) ? '"a"' : '"b"';
                    listview.append(' <li data-theme=' + theme +
                        ' > <a href="#"> <img src="http://jqmdesigner.appspot.com/images/image.png" class="ui-li-icon">'
                        + _allScannedProducts[i].productType + '       '
                        + _allScannedProducts[i].productNumber + '</a> </li>')
                }

                $('[data-role=listview]').listview().listview('refresh');
            }
            else
                listview.empty();


        })
    }
})();


// statements
