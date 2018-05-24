(function () {


    $(document).delegate(".ui-content", "scrollstart", false);

    $("#gk56hfbl").on('input', function (e) {
        if ($(this).val().trim()) {
            $(".ui-grid-b").css("display", "none");
            var parent = $("#" + $(this).val().toUpperCase()).parent();
            parent.css("display", "initial");
            var children = parent.children().css("display", "none");
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