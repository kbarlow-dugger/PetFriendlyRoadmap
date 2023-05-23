// Draw divs for decorative left border
function drawLeftBorder (){
  let leftBorderContainer = document.getElementsByClassName('leftBorder')[0];
  let windowHeight = $(window).height();
  for (let i=0; i<(windowHeight/200); i++) {
    let circle = document.createElement('div');
    $(circle).addClass("leftBorderCircles");
    if (i % 2 === 0) {
      circle.style.backgroundColor = "#A4D555";
      leftBorderContainer.append(circle);
    } else {
      circle.style.backgroundColor = "#4CDEF5";
      leftBorderContainer.append(circle);
    }
  };
};
drawLeftBorder();

// Draw divs for decorative right border
function drawRightBorder (){
  let rightBorderContainer = document.getElementsByClassName('rightBorder')[0];
  let windowHeight = $(window).height();
  for (let i=0; i<(windowHeight/200); i++) {
    let circle = document.createElement('div');
    $(circle).addClass("rightBorderCircles");
    if (i % 2 === 0) {
      circle.style.backgroundColor = "#FF5992";
      rightBorderContainer.append(circle);
    } else {
      circle.style.backgroundColor = "#A4D555";
      rightBorderContainer.append(circle);
    }
  };
};
drawRightBorder();

searchText = '';

// Create function to initialize map
function initMap(business, latlng) {
  let directionsDisplay = new google.maps.DirectionsRenderer();
  let location = latlng;
  let map = new google.maps.Map(document.getElementById(business), {
    center: location,
    zoom: 15
  });
  directionsDisplay.setMap(map);

  // Set origin, destination, and travel mode for route calculation
  let start = window.searchText;
  let end = latlng;
  let request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };

  // Pass directions settings to the Google directions service
  let directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      // Display the route
      directionsDisplay.setDirections(result);
    }
  });
};

  // Add click event for search
  $('button').click((e) => {
  e.preventDefault();
  // Hide search form and photo
  $('.searchForm').hide();
  $('.photo').hide();

  // Get input text to use for search
  window.searchText = $('#location').val();
  
  // Define the settings for the API call //`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?categories=restaurants,bars&open_now=true&sort_by=distance&location=${window.searchText}`,
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=dogs&categories=bars&limit=25&radius=20000&sort_by=distance&location=${window.searchText}`,
    "method": "GET",
    "headers": {
      "authorization": "Bearer Ye-91IGpkqa8Awzi7I2IaNGtfBBICvZjqIRSK-I41kv-GLafsgdSQCh5n7LRZXwKlZDD4TGCTksDCPXg94VNDqyAWREdlje_XFYdjgFXNs8bSkDS5dFmY7wRAoWyYnYx"
    }
  }

  // Use AJAX to perform Yelp API call
  $.ajax(settings).done(function (response) {
    let results = response.businesses;

    // Create div to hold all search results
    let resultsDiv = document.createElement('div');
    $(resultsDiv).addClass('searchResults');
    $('main').append(resultsDiv);
    // Add instructions message
    let message = document.createElement('p');
    message.innerText = 'Open up Excel and download this data. Then, hit the button above to return to main screen.';
    $('header').append(message);
	
    // Display results
    results.forEach(function(business) {
      // Create each business result div
      let businessInfo = document.createElement('table');
      let businessName = business.name;
	  let businessPrice = business.price;
	  if (businessPrice === undefined) {businessPrice="?";}
	  let businessRating = business.rating;		  
      let businessAddress = `${business.location.display_address[0]}, ${business.location.display_address[1]}`;
	  let businessCat = business.categories[0].title; 
	  let businessURL = business.url;
	  let businessReviews = business.review_count;
  	  let lat = business.coordinates.latitude; let long = business.coordinates.longitude;
	  let distance = Math.round(business.distance,0);
      businessInfo.innerHTML = `<tr><td width="350px;">${businessName} <a href=${businessURL} target="_new">(yelp)</a></td><td width="400px;">${businessAddress}</td><td width="160px;">${businessCat}</td><td width="20px;">${businessRating}</td><td width="25px;"> ${businessReviews}</td><td style="text-align:right; width:70px;">${distance}</td><td style="font-size:20%">${businessURL}</td></tr>`; 
	  
      // Create each details div
      let details = document.createElement('div');
      let businessImg = business.image_url;
      let category = business.categories[0].title;
      let phone = business.display_phone;
      let price = business.price;
      let geo = {lat: business.coordinates.latitude, lng: business.coordinates.longitude};
      let mapDiv = document.createElement('div');
      details.innerHTML = `<p></p>`;
      $(details).addClass('detail');

      // Add map div to details

      // Add divs to DOM
/*      $(businessInfo).append(details);  */
      $('.searchResults').append(businessInfo);
    })

    // Re-draw borders based on length of content in search results
	drawLeftBorder();
    drawRightBorder();
  })
  // Error handling
  .fail(function() {
    let errorMessage = document.createElement('p');
    errorMessage.innerText = "We're sorry. Your search did not return any results. Please click the logo if you'd like to try again. If this is your first search of the day, you will need to authenticate to test mode. Select the GET TEMP DEMO ACCESS link and opt in to demo mode.";
    $('main').append(errorMessage);
  });
});

// Reset search when user clicks on logo
$('#logo').click((e) => {
  e.preventDefault();
  // Remove all relevant values
  $('#location').val('');
  $('.searchResults').remove();
  window.searchText = '';
  // Show search form and photo
  $('.searchForm').show();
  $('.photo').show();
})
