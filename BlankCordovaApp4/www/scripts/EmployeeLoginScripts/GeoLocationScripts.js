//هذا التابع الرئيسي 
function initMap() {

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var geocoder = new google.maps.Geocoder;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: { lat: 51.1253664, lng: 4.2096528 }
    });

    directionsDisplay.setMap(map);


    GetCurrentLocation().then((pos) => {

        geocodeLatLng(geocoder, pos).then(function (address) {
            calculateAndDisplayRoute(directionsService, directionsDisplay, address);
        });

        GetLatLngFromAddress(geocoder, "Boodtsstraat 12, 9140 Temse").
            then((pos2) => {
                try {
                    var tt = getDistance(pos, pos2);
                    swal(tt + "m");
                } catch (e) {
                    swal(e.message);
                }
            });

    });

}

var rad = function (x) {
    return x * Math.PI / 180;
};

var getDistance = function (p1, p2) {

    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};


//استعادة الموقع !!
//pos = {
//    lat: position.coords.latitude,
//    lng: position.coords.longitude
//};
function GetCurrentLocation() {
    return new Promise((resolve, reject) => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                resolve(pos);

            }, function () {
                handleLocationError();
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError();
        }

    })
}

//تابع الخطأ !!
function handleLocationError() {
    swal("error")
}

//هنا نعطيه المطال فيرجع لنا العنوان 
function geocodeLatLng(geocoder, pos) {
    return new Promise((resolve, reject) => {
        geocoder.geocode({ 'location': pos }, function (results, status) {
            if (status === 'OK') {
                //alert(pos.lat);
                if (results[0]) {
                    resolve(results[0].formatted_address);
                    //alert(results[0].formatted_address);
                } else {
                    reject('No results found');
                    swal('No results found');
                }
            } else {
                reject('Geocoder failed due to: ' + status);
                swal('Geocoder failed due to: ' + status);
            }
        });


    })


}

//هنا نعطيه العنوان فيرجع لنا 
function GetLatLngFromAddress(geocoder, address) {

    return new Promise((resolve, reject) => {

        geocoder.geocode({ 'address': address }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                var pos = { lat: latitude, lng: longitude };
                resolve(pos);
            }
        });

    });
}

//هنا نحسب المسافة بين موقعين !
function calculateAndDisplayRoute(directionsService, directionsDisplay, address) {

    directionsService.route({
        origin: address,
        destination: "Boodtsstraat 12, 9140 Temse",
        travelMode: google.maps.TravelMode["WALKING"]
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            swal('Directions request failed due to ' + status);
        }
    });
}

