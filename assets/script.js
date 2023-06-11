var apiKey = 'qHqc0M7bu2zPLS268h6g49uEUPPzQ6LT13FYybRA';

var weatherContainer = document.getElementById('weatherContainer');
var roverForm = document.getElementById('roverForm');
var photosContainer = document.getElementById('photosContainer');
var dateInputEl = $('#dateInput');

// Function to fetch Mars weather data
var fetchMarsWeather = () => {
  var apiUrl = 'https://api.nasa.gov/insight_weather/?api_key='+ apiKey +'&feedtype=json&ver=1.0';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        var weather = data.weather;
        weatherContainer.innerHTML = '';

        for (var [key, value] of Object.entries(weather)) {
            var weatherDetailE1 = document.createElement('div');
            weatherDetailE1.classList.add('weather-details');

            var labelE1 = document.createElement('span');
            labelE1.classList.add('weather-label');
            labelE1.textContent = `${key}`;

            var valueE1 = document.createElement('span');
            valueE1.classList.add('weather-value');
            valueE1.textContent = value;

            weatherDetailE1.appendChild(labelE1);
            weatherDetailE1.appendChild(valueE1);
            weatherContainer.appendChild(weatherDetailE1);
        }
    })
    .catch(error => {
      console.log('Error fetching Mars weather:', error);
    });
};

//function to fetch photos from rover api
var fetchRoverPhotos = (rover, date) => {
  var apiUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + rover + '/photos?earth_date=' + date + '&api_key=' + apiKey;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        var photos = data.photos;
        photosContainer.innerHTML = '';

        // Limit the photos to 10 for example
        photos = photos.slice(0, 5);

        photos.forEach(photo => {
            var photoUrl = photo.img_src;
            var roverName = photo.rover.name;
            var cameraName = photo.camera.full_name;

            var imgE1 = document.createElement('img');
            imgE1.src = photoUrl;
            imgE1.alt = `${roverName} - ${cameraName}`;
            imgE1.classList.add('photo'); // move the 'photo' class to the img element

            photosContainer.appendChild(imgE1); // append img directly to photosContainer
        });
    })
    .catch(error => {
      console.log('Error fetching rover photos:', error);
    });
};

  
  // Event listener for the rover form submission
  roverForm.addEventListener('submit', event => {
    event.preventDefault();
  
    var roverSelect = document.getElementById('roverSelect');
    var dateInput = document.getElementById('dateInput');

    var selectedRover = roverSelect.value;
    var selectedDate = dateInput.value;

    if(dayjs().isBefore(dayjs(selectedDate))){
      console.log('Error, wrong date');
      selectedDate = dayjs().format('YYYY-MM-DD');;
    }

    fetchRoverPhotos(selectedRover, selectedDate);
    
  });  
  // Call the function to fetch Mars weather on page load
  fetchMarsWeather();