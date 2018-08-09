
MainPage_Init();

var currentContainer = null;


function MainPage_Init() {
    socket.emit("OpenScannedDocument");

    socket.on("OpenedScannedDocument", (openedScannedDocument) => {

        if (openedScannedDocument) {

            swal({
                title: 'Retriving Container Numbers',
                text: 'Start to creating container',
                timer: 500,
                onOpen: () => {
                    swal.showLoading();
                    GetAllScannedProducts(openedScannedDocument.container_number).then((items) => {

                        FillListview("MainPageListView", items, openedScannedDocument.container_number);
                        currentContainer = openedScannedDocument.container_number;
                        GetContainerAge(openedScannedDocument.container_Date);

                    });

                }
            })
        }

    });
}


function GetAllScannedProducts(containerNumber) {

    return new Promise((resolve, reject) => {

        socket.emit("GellAllScannedProducts", containerNumber);


        socket.on("GettingAllScannedContainerNumbers", (_allScannedProducts) => {

            if (_allScannedProducts) {


                return resolve(_allScannedProducts);

            }

            else
                return resolve(null);


        })

    })
}


function FillListview(listviewName, items, containerNumber) {

    var listview = $("#" + listviewName);
    listview.empty();
    listview.append(' <li   data-role="list-divider">' + containerNumber + "   -   " +
        items.length + '</li>');
    if (items.length) {

    }
    for (var i = 0; i < items.length; i++) {

        listview.append('<li data-icon="false" is="listview-li"> <a href="#">' +
            items[i].productType +
            '<span i class= "ui-li-count" >1</span > </a > </li > ');
    }
    $('[data-role=listview]').listview().listview('refresh');
}

//هنا لتحديد عدد أيام الكونتينر 
function GetContainerAge(date) {
    $("#ContainerAge").text(moment().diff(date, "days"));
    $("#monthContainer").text(date.format("MMMM"));
    $("#dayContainer").text(date.format("dddd"));


}



////هنا للسحب للأسفل و تحديث الصفحة !! 
//$('#MainPage').pull_to_refresh({
//    refresh: function (stoploading) {
//        MainPage_Init();
//        stoploading();
//    },
//    pull_to_refresh_text: 'Pull down to refresh...',
//    letgo_text: 'Release to refresh...',
//    refreshing_text: 'Refreshing...',
//    status_indicator_id: 'pull_to_refresh',
//    refreshClass: 'refresh',
//    visibleClass: 'visible',
//});


$("#mainPageCloseContainer").click(() => {

    if (currentContainer) {
        swal({
            title: 'هل أنت متأكد ؟',
            text: "لن تستطيع الرجوع للكونتير",
            type: 'warning',
            cancelButtonText: "لا",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم'
        }).then((result) => {

            if (result) {


                socket.emit("CloseingContainer", currentContainer)

                socket.on("ClosedContainer", (status) => {

                    if (typeof (status) == 'boolean') {
                        if (status)
                            swal("تم إغلاق الكونتير ")
                    }
                    else
                        if (typeof (status) == 'string') {
                            swal(status);
                        }
                        else
                            swal("لم يتم إغلاق الكونتير")
                })


            }
        })

    }


})


$("#printContainerBtn").click(() => {

    if (currentContainer) {
        PrintScannedProductReport(currentContainer);
    }
});