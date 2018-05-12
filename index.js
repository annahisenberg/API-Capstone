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
        results.push(`
        <p>${shelterArray[i].name.$t}</p>
        `);
    }
    $('.displayResults').html(results);
}


$(clickGo);