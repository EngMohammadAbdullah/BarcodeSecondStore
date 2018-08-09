
var allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
(
    function ProductTypesManagePageScriptInit() {


        try {

            socket.emit("GetAllProductDegrees");
            socket.on("GettingAllProductDegrees", alldegrees => {

                var listview = $("#listviewDegrees");
                for (var i = 0; i < alldegrees.length; i++) {
                    listview.append(
                        ' <li data-number="' + alldegrees[i].dNumber + '" data-name="' +
                        alldegrees[i].dName + '" > <a href="#"> <img src="http://jqmdesigner.appspot.com/images/image.png" class="ui-li-icon">'
                        + alldegrees[i].shortcut + '</a> </li>')

                    $('#listviewDegrees').listview().listview('refresh');

                }
            });


            //هذا الحدث لإضافة نوع جديد للائحة
            //يقوم بتوليد 
            $("#addProductDegree").click(() => {


                if ($("#productDegreeShortcut").val().length > 4) {
                    swal("الاختصار لا يجب أن يزيد عن 4 حروف!!");
                    return;
                }
                var myArr = $('#listviewDegrees li');
                for (var i = 0; i < myArr.length; i++) {
                    if ($(myArr[i]).text().trim().toUpperCase() ==
                        $("#productDegreeShortcut").val().trim().toUpperCase()) {
                        swal("degree Exist");
                        return;
                    }
                }

                var listview = $("#listviewDegrees");
                var dNumber = "";
                //allLetters used to generate number to the Degree
                for (var i = 0; i < $("#productDegreeShortcut").val().length; i++) {
                    var temp =
                        (allLetters.indexOf($("#productDegreeShortcut").val()[i].toUpperCase()) + 1);
                    dNumber += temp;
                }


                listview.append(
                    ' <li data-number="' + dNumber + '" data-name="' +
                    $("#productDegreeText").val().trim().toUpperCase() + '" > <a href="#"> <img src="http://jqmdesigner.appspot.com/images/image.png" class="ui-li-icon">'
                    + $("#productDegreeShortcut").val().trim().toUpperCase() + '</a> </li>')

                $('#listviewDegrees').listview().listview('refresh');
            });

            //لتخزين العناصر في الإنترنت 
            $("#StoreNewProductDegreeInDB").click(() => {

                var allTypes = [];

                var allItems = $('#listviewDegrees li');

                for (var i = 0; i < allItems.length; i++) {
                    var typeItem = {};
                    typeItem.shortcut = $(allItems[i]).text().trim();
                    typeItem.dNumber = $(allItems[i]).attr("data-number");
                    typeItem.dName = $(allItems[i]).attr("data-name");
                    allTypes.push(typeItem);
                }
                if (allTypes.length) {

                    socket.emit("AddingProductDegree", allTypes);
                    socket.on("GettingProductDegree", (status) => {


                        if (status) {
                            swal("تم التخزين بنجاح ")
                        }
                    })
                }
                else
                    swal("لا يوجد أنواع جديدة لتخزينها ")

            })

        }
        catch (e) {
            alert(e.message);
        }
    }
)();