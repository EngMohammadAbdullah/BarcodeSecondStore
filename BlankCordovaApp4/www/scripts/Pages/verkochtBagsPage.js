
$("#verkochtBagsPage").on("swipeleft swiperight", "#verkochtBagslistview li", function (event) {
    var listitem = $(this),
        // These are the classnames used for the CSS transition
        dir = event.type === "swipeleft" ? "left" : "right",
        // Check if the browser supports the transform (3D) CSS transition
        transition = $.support.cssTransform3d ? dir : false;
    confirmAndDelete(listitem, transition);
});

 function confirmAndDelete(listitem, transition) {
    swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
       
        if (result) {
          
            listitem.remove();
            $('[data-role=listview]').listview().listview('refresh');
            swal(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })
    }
