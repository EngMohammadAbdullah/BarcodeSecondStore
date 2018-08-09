
$(document).on('pageshow', '#OpenCloseContainerPage', function () {

    $("#listViewContainerNumbers").empty();
    GetOrOpenNewContainerNumber();

    socket.emit("GetAllScannedContainerNumbers");
    // Show full page LoadingOverlay
    // $.LoadingOverlay("show");

    GetAllScannedContainerNumbers();
});


function GetOrOpenNewContainerNumber() {
    socket.emit("OpenScannedDocument");
    //after Getting Object
    socket.on("OpenedScannedDocument", (openedScannedDocument) => {

        if (openedScannedDocument) {

            swal({
                title: 'Retriving Container Numbers',
                text: 'Start to creating container',
                timer: 1000,
                onOpen: () => {
                    swal.showLoading()
                    $("#containerNoHeader").
                        text(openedScannedDocument.container_number);
                }
            })
        }

    });
}

var openBtn = $("#openContainerScanDocument");
var closeBtn = $("#closeContainerScanDocument");
openBtn.click(GetOrOpenNewContainerNumber);

closeBtn.click(() => {
    //swal("Open document !!")
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
                    var liElement = $('<li data-theme=' + theme + '> </li>');

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