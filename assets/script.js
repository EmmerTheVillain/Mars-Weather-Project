var apiKey = 'qHqc0M7bu2zPLS268h6g49uEUPPzQ6LT13FYybRA';

var weatherContainer = document.getElementById('weatherContainer');
var roverForm = document.getElementById('roverForm');
var photosContainer = document.getElementById('photosContainer');
var weatherDate = document.getElementById('weatherDate');
var currentPhotoIndex = 0;

// Function to fetch Mars weather data
var fetchMarsWeather = () => {
  var apiUrl = 'https://api.nasa.gov/insight_weather/?api_key='+ apiKey +'&feedtype=json&ver=1.0';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        var latestSol = data.sol_keys[data.sol_keys.length -1];
        var weather = data[latestSol];
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

        var date = dayjs(latestSol).format('MMMM D, YYYY');
        weatherDate.textContent = date;
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
        var roverPhotos = data.photos;
        photosContainer.innerHTML = '';

        // Limit the photos to 10 for example
        var limitedPhotos = photos.slice(0, 5);

        limitedPhotos.forEach((photo, index) => {
            var photoUrl = photo.img_src;
            var roverName = photo.rover.name;
            var cameraName = photo.camera.full_name;

            var slideE1 = document.createElement('div');
            slideE1.classList.add('slide');

            var imgE1 = document.createElement('img');
            imgE1.src = photoUrl;
            imgE1.alt = `${roverName} - ${cameraName}`;
            imgE1.classList.add('photo'); // move the 'photo' class to the img element
            slideE1.appendChild(imgE1);
            photosContainer.appendChild(imgE1); // append img directly to photosContainer
        });
        showSlide(currentPhotoIndex);
    })
    .catch(error => {
      console.log('Error fetching rover photos:', error);
    });
};

var showSlide = (index) => {
  var slides = document.querySelectorAll('.slide');

  slides.forEach((slide, i) => {
    if (i === index) {
      slide.style.display = 'block';
    } else {
      slide.style.display = 'none';
    }
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

  document.getElementById('nextButton').addEventListener('click', () => {
    currentPhotoIndex++;
    var slides = document.querySelectorAll('.slide');

    if (currentPhotoIndex >= slides.length) {
      currentPhotoIndex = 0;
    }

    showSlide(currentPhotoIndex);

  });

  document.getElementById('prevButton').addEventListener('click', () => {
    currentPhotoIndex--;
    var slides = document.querySelectorAll('.slide');

    if (currentPhotoIndex < 0) {
      currentPhotoIndex = slides.length -1;
    }

    showSlide(currentPhotoIndex);

  });
  // Call the function to fetch Mars weather on page load
  fetchMarsWeather();