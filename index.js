let shelterData;
let zipCode;
let petfinder_URL;
let longitude;
let latitude;
var map;

function clickGo() {
    $('button').click(event => {
        event.preventDefault();
        zipCode = $('input').val();
        petfinder_URL = `http://api.petfinder.com/shelter.find?format=json&key=705081f265b2ea3051d728969b1eccfd&animal=cat&location=${zipCode}&output=basic&callback=?`;
        apiRequest();
        //clear text input
        $('input:text').val('');
        $(initMap);
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
    longitude = obj.petfinder.shelters.shelter.longitude.$t;
    latitude = obj.petfinder.shelters.shelter.latitude.$t;

    for (let i = 0; i < shelterArray.length; i++) {
        results.push(`
        <p>${shelterArray[i].name.$t}</p>
        `);
    }
    $('.displayResults').html(results);
}


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: latitude,
            lng: longitude
        },
        zoom: 8
    });
    ('#map').show();
}

$(clickGo);