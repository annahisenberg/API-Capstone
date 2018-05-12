let shelterData;
let zipCode;
let petfinder_URL;
let longitude;
let latitude;


function clickGo() {
    $('button').click(event => {
        event.preventDefault();
        zipCode = $('input').val();
        petfinder_URL = `http://api.petfinder.com/shelter.find?format=json&key=705081f265b2ea3051d728969b1eccfd&animal=cat&location=${zipCode}&output=basic&callback=?`;
        apiRequest();
        //clear text input
        $('input:text').val('');
    });
}

function apiRequest() {
    $.getJSON(petfinder_URL)
        .done(function (responseData) {
            shelterData = responseData;
            initMap();
            renderResults(responseData);
        })

}



function renderResults(obj) {
    const shelterArray = obj.petfinder.shelters.shelter;
    let results = [];

    for (let i = 0; i < shelterArray.length; i++) {
        results.push(`
        <p>${shelterArray[i].name.$t}</p>
        `);
    }
    $('.displayResults').html(results);
}




function initMap() {

    let location;

    // Show default location
    location = {
        lat: 40.659177,
        lng: -73.958434
    };

    //If the response does not equal undefined, then take the first shelter of the array 
    //and use it for the map's location
    if (shelterData) {
        location = {
            lat: Number(shelterData.petfinder.shelters.shelter[0].latitude.$t),
            lng: Number(shelterData.petfinder.shelters.shelter[0].longitude.$t)
        };

    };

    //Load map
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: location
    });

    //Adds the initial marker
    function addsMarkers(place) {
        var marker = new google.maps.Marker({
            position: place,
            map: map
        });
    }

    addsMarkers(location);

    if (shelterData) {
        for (let i = 0; i < shelterData.petfinder.shelters.shelter.length; i++) {
            location.lat = Number(shelterData.petfinder.shelters.shelter[i].latitude.$t);
            location.lng = Number(shelterData.petfinder.shelters.shelter[i].longitude.$t);
            console.log(location);
            addsMarkers(location);
        }

    }
}



$(clickGo);