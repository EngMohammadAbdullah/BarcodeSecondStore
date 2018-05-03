
//هذا الحدث لإضافة نوع جديد للائحة
//يقوم بتوليد 
$("#addProductType").click(() => {

    var myArr = $('#listviewCategoryTypes li');

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
        socket.on("StoringNewProductTypes", (status) => {


            if (status) {
                swal("تم التخزين بنجاح ")
            }
        })
    }
    else
        swal("لا يوجد أنواع جديدة لتخزينها ")

})