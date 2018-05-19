let shelterData;
let zipCode;
let petfinder_URL;
let shelterAddress;


//Handles the "go" button
function clickGo() {
    $('button').click(event => {
        event.preventDefault();
        zipCode = $('input').val();

        if (zipCode.length < 5) {
            $('.invalid').html(`<p>Invalid zip code.</p>`);
            $('input:text').addClass('invalid-input'); //This class adds a shake effect
            $('input:text').val(''); //Clears text input
        }

        if (zipCode.length === 5) {
            $('.invalid').empty();

            petfinder_URL = `https://api.petfinder.com/shelter.find?format=json&key=705081f265b2ea3051d728969b1eccfd&animal=cat&location=${zipCode}&output=basic&callback=?`;
            petfinderApiRequest();
            $('input:text').val(''); //clears text input
        }
    });
}

//This removes the invalid-input class (which does the shake effect) after it's used
function createAnimationendListener() {
    $('html').on('animationend webkitAnimationEnd oAnimationEnd', (e) => {
        $('input:text').removeClass('invalid-input');
    });
}


function petfinderApiRequest() {
    $.getJSON(petfinder_URL)
        .done(function (responseData) {
            shelterData = responseData;
            initMap();
            renderResults(responseData);
        })
}


//Render list of shelters
function renderResults(obj) {
    const shelterArray = obj.petfinder.shelters.shelter;
    let results = [];

    for (let i = 0; i < shelterArray.length; i++) {
        let shelterName = `${i + 1}. ${shelterArray[i].name.$t}`;

        results.push(`
        <div class="shelter-list-item">
            <h3>${shelterName}</h3>
            <p id="${shelterArray[i].id.$t}"></p>
        </div>
        `);
    }

    $('.displayResults').html('<h2>Here are the shelters closest to you:</h2>' + results);
    loadShelterAddresses(obj); //Call this function to load addresses from GoogleMaps API
}




function initMap() {

    let location;

    // This is the default location when page first loads
    location = {
        lat: 40.659177,
        lng: -73.958434
    };

    //If there is a response (shelterData) after api call, then take the first shelter of the array and use it for the map's location
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


    //This function adds the initial marker to the map
    function addsMarkers(place, shelterName) {
        var contentString = shelterName;

        var infowindow = new google.maps.InfoWindow({
            content: contentString //This is what will be displayed in the infowindow
        });

        var marker = new google.maps.Marker({
            position: place,
            map: map
        });

        //Adds the popup infowindow when marker is clicked on
        marker.addListener('click', function () {
            infowindow.open(map, marker)
        });
    }
    //Call this function to add the first marker to the map for the default location
    addsMarkers(location);


    //Loops through the response data and gathers longitude, latitude, and name of each shelter and then adds markers to all
    if (shelterData) {
        for (let i = 0; i < shelterData.petfinder.shelters.shelter.length; i++) {
            location.lat = Number(shelterData.petfinder.shelters.shelter[i].latitude.$t);
            location.lng = Number(shelterData.petfinder.shelters.shelter[i].longitude.$t);
            shelterN = shelterData.petfinder.shelters.shelter[i].name.$t
            addsMarkers(location, shelterN);
        }

    }

}

// This function uses Google Maps' reverse geocoding to get the shelters' addresses 
// using their latitudes and longitudes 
function loadShelterAddresses(obj) {

    const shelterArray = obj.petfinder.shelters.shelter;

    for (let i = 0; i < shelterArray.length; i++) {
        let shelterID = shelterArray[i].id.$t;
        let lat = Number(shelterArray[i].latitude.$t);
        let lng = Number(shelterArray[i].longitude.$t);

        let getAddressURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDbEkT06yRxGSnhfi9b45Ww21HHfdfkBuU`;


        //Makes API call for each shelter in the array, selects the shelter by it's ID,
        // and renders the formatted address. 
        $.getJSON(getAddressURL)
            .done(function (data) {
                $(`#${shelterID}`).html(data.results[0].formatted_address);
            })
    }
}


$(clickGo);
$(createAnimationendListener);