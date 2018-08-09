
//  هذا التابع يطبع تقرير عن البالات التي تم تخزينها 
function PrintScannedProductReport(containerNo) {

    socket.emit("GellAllScannedProducts", containerNo);

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