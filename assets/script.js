var apiKey = 'qHqc0M7bu2zPLS268h6g49uEUPPzQ6LT13FYybRA';

var weatherContainer = document.getElementById('weatherContainer');
var roverForm = document.getElementById('roverForm');
var photosContainer = document.getElementById('photosContainer');
var dateInputEl = $('#dateInput');
var hisBtn = $('.historyCard');
var weatherDate = document.getElementById('weatherDate');
var currentPhotoIndex = 0;

// Function to fetch Mars weather data
var fetchMarsWeather = () => {
  var apiUrl = 'https://api.nasa.gov/insight_weather/?api_key='+ apiKey +'&feedtype=json&ver=1.0';
  //fetch for weather api
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        var latestSol = data.sol_keys[data.sol_keys.length -1];
        var weather = data[latestSol];
        console.log(data);
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
      //sets latestSol to the date input
        var date = dayjs(latestSol).format('MMMM D, YYYY');
        weatherDate.textContent = date;
    })
    //error log output
    .catch(error => {
      console.log('Error fetching Mars weather:', error);
    });
};

//function to fetch photos from rover api
var fetchRoverPhotos = (rover, date) => {
  var apiUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + rover + '/photos?earth_date=' + date + '&api_key=' + apiKey;

  //fetch api for photo spi
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        var roverPhotos = data.photos;
        photosContainer.innerHTML = '';

        // Limit the photos to 10 for example
        var limitedPhotos = roverPhotos.slice(0, 5);

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
            photosContainer.appendChild(slideE1); // append img directly to photosContainer
        });
        showSlide(currentPhotoIndex);
    })
    .catch(error => {
      console.log('Error fetching rover photos:', error);
    });
};

var saveHistory = (rover, date) =>{  

  const element = {
    rover : rover,
    date : date
  };

  var history = JSON.parse(localStorage.getItem('history'));
  if(history == null)
    history = Array();
  else{
    //prevent save repeted elements 
    for (let i = 0; i < history.length; i++) {
      if((history[i].rover == rover) && (history[i].date == date)){
        return;
      }
    }
  }
  //save element in local storage
  history.push(element);
  localStorage.setItem('history', JSON.stringify(history));
  renderHistory();
}

var renderHistory = () => {
  var history = JSON.parse(localStorage.getItem('history'));
  container = $('.historyCard');

  container.empty();

  if(history == null)
      history = Array();

  for(var i = 0; i < history.length; i++){
      var historyELement = $('<button type="button" id="historyButton" class="btn btn-primary col-4 m-2"></button>');
      historyELement.text((history[i].rover + ' (' + history[i].date + ')'));
      container.append(historyELement);
  }
}
  
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
    
    saveHistory(selectedRover, selectedDate);
    fetchRoverPhotos(selectedRover, selectedDate);
    
  });  

  hisBtn.on('click', '#historyButton', function (event) {
    var history = JSON.parse(localStorage.getItem('history'));
    historyELement = history[$(this).index()];
    fetchRoverPhotos(historyELement.rover, historyELement.date);
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
  renderHistory();
  fetchMarsWeather();