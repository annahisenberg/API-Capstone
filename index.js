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
            renderResults(responseData);
            // console.log(responseData);
        })
    // .error(function (err) {
    //     alert('Error retrieving data!');
    // });
}



function renderResults(obj) {
    const shelterArray = obj.petfinder.shelters.shelter;
    let results = [];

    for (let i = 0; i < shelterArray.length; i++) {
        console.log(shelterArray[i].longitude.$t);
    }

    for (let i = 0; i < shelterArray.length; i++) {
        console.log(shelterArray[i].latitude.$t);
    }


    for (let i = 0; i < shelterArray.length; i++) {
        results.push(`
        <p>${shelterArray[i].name.$t}</p>
        `);
    }
    $('.displayResults').html(results);
}


var map;

function initMap() {

    var location = {
        lat: 40.659177,
        lng: -73.958434
    };

    // Get all the fetched data 

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: location
    });

    function allPlaces(place) {
        var marker = new google.maps.Marker({
            position: place,
            map: map
        });
    }


    // Here we will call all the locations using a loop
    allPlaces(location);

}

// initMap();


$(clickGo);