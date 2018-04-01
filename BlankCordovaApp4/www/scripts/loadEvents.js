function loadDeviceReadyEvents() {
    $('#testPromise').click(function () {

        try {
            openDb().then(function (status) {
                Promise.resolve(tableExist("Customer")).then(function (exist) {
                    swal("not exist")
                }, function () {
                    return Promise.resolve(getData("Customer"));
                }).then(function (res) {
                    swal(result[0]["productNumber"])
                });

            });
            //openDb().then(function (status) {
            //   .then(function (status) {
            //        if (status) {
            //            swal("table Exis")
            //        }
            //        else
            //            swal("table not exist")
            //    })
            //})

        } catch (e) {
            swal(e.message)
        }
        //openDbPromise().then(function (db) {
        //    if (db) {
        //        swal("Good");
        //    }
        //    else
        //        swal("Bad");
        //})
    })

    $('#OpenDatabaseBtn').click(function () {
        try {
            if (typeof Dbfile !== 'undefined' &&
                window.sqlitePlugin !== undefined) {

                GenerateDatabase(function (res) {
                    if (res) {
                        centerDatabase = res;
                        //swal("Sucess")

                    }
                    else
                        swal("Failed")
                })
            }
            else
                swal("Not supported", "", "error")
        } catch (e) {
            swal(e.message, 'error')
        }


        //نجحت
        //var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        //db.transaction(populateDB, errorCB, successCB);
    });

    $("#InsertData").click(function () {
        var ddd = {};
        AddUser(dd);
    });
    $("#GetData").click(function () {
        try {
            CreateList();

        } catch (e) {
            swal(e.message, "", "error");
        }
    });
    $("#AllUsersBill").on("swipeleft", "li", function (event) {
        var listitem = $(this),
            // These are the classnames used for the CSS transition
            dir = event.type === "swipeleft" ? "left" : "right",
            // Check if the browser supports the transform (3D) CSS transition
            transition = $.support.cssTransform3d ? dir : false;
        showAlert(listitem, transition);
    });

    function showAlert(listitem, transition) {
        swal("Hello I got swiped")
    }


    var page = '<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="description" content="Emulating real sheets of paper in web documents (using HTML and CSS)"> <title>Sheets of Paper</title> <style> html, body { margin: 0; padding: 0; font-family: "Roboto", -apple-system, "San Francisco", "Segoe UI", "Helvetica Neue", sans-serif; font-size: 12pt; background-color: #eee; } * { /* Include the content box as well as padding and border for precise definitions */ box-sizing: border-box; -moz-box-sizing: border-box; } .page { margin: 1cm auto; background: #fff; box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2); outline: 0; } div.page-break { page-break-after: always; } h1 { page-break-before: always; } h1, h2, h3, h4, h5, h6 { page-break-after: avoid; } p { margin: 0; } p + p { margin-top: 0.5cm; } a { text-decoration: none; color: black; } table { page-break-inside: avoid; } @page { orphans: 4; widows: 2; } @media print { html, body { background-color: #fff; } .page { width: initial !important; min-height: initial !important; margin: 0 !important; padding: 0 !important; border: initial !important; border-radius: initial !important; background: initial !important; box-shadow: initial !important; page-break-after: always; } } .page { width: 21cm; min-height: 29.7cm; padding-left: 2cm; padding-top: 2cm; padding-right: 2cm; padding-bottom: 2cm; } @page { size: A4 portrait; margin-left: 2cm; margin-top: 2cm; margin-right: 2cm; margin-bottom: 2cm; } </style></head><body class="document"> <div class="page" contenteditable="true"> <p>First <code>.page</code> element</p> <p>Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> <p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p> <p>Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p> <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p> <div class="page-break"></div> <p>This sentence is preceded by a manual line break:<br /><code>&lt;div class="page-break"&gt;&lt;/div&gt;</code></p> <p>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.</p> <p>Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p> </div> <div class="page" contenteditable="true"> <p>Second <code>.page</code> element</p> <p>Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> <p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p> <p>Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p> </div></body></html>';


    //try {
    //    cordova.plugins.printer.print(page,
    //        { duplex: 'long' }, function (res) {
    //            if (res) {
    //                swal("Done")
    //            } else
    //                swal("Canceled")
    //        });
    //} catch (e) {
    //    swal(e.message);
    //}

}