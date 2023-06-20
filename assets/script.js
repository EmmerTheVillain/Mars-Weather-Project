var apiKey = 'qHqc0M7bu2zPLS268h6g49uEUPPzQ6LT13FYybRA';

var spaceContainer = document.getElementById('spaceContainer');
var roverForm = document.getElementById('roverForm');
var photosContainer = document.getElementById('photosContainer');
var dateInputEl = $('#dateInput');
var hisBtn = $('.historyCard');
var currentPhotoIndex = 0;
var errorMessage = document.getElementById('errorMessage');
var latitudeEl 
var longitudeEl

// Function to fetch Mars weather data
var fetchSpaceEvents = () => {
  var apiUrl = 'https://api.allorigins.win/raw?url=http://api.open-notify.org/astros.json';

  // Fetch for astronauts API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var astronauts = data.people;
      
      var spaceInfo = document.getElementById('spaceInfo');
      spaceInfo.innerHTML = '';
      
      var astronautsE1 = document.createElement('div');
      astronautsE1.classList.add('astronauts');
      
      astronauts.forEach(astronaut => {
        var astronautE1 = document.createElement('div');
        astronautE1.classList.add('astronaut');
        astronautE1.classList.add('list-item');
        
        var nameE1 = document.createElement('span');
        nameE1.textContent = 'Name: ' + astronaut.name;
        
        var craftE1 = document.createElement('span');
        craftE1.textContent = ' Craft: ' + astronaut.craft;
        
        astronautE1.appendChild(nameE1);
        astronautE1.appendChild(craftE1);
        astronautsE1.appendChild(astronautE1);
      });
      spaceInfo.appendChild(astronautsE1);
    })
    .catch(error => {
      console.log('Error fetching astronauts:', error);
    });
};
var map = L.map('map', {
  center: [0,0],
  zoom: 1
});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var trackISSLocation = () => {
  var apiUrl = 'https://api.allorigins.win/raw?url=http://api.open-notify.org/iss-now.json';
  
    // Fetch for ISS location API
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var location = data.iss_position;
      var latitude = data.iss_position.latitude;
      var longitude = data.iss_position.longitude;
      console.log(latitude);
      console.log(longitude);
      var locationInfo = document.getElementById('locationInfo');
      // locationInfo.innerHTML = '';
      latitudeEl = latitude;
      longitudeEl = longitude;

      var marker = L.marker([latitudeEl, longitudeEl]).addTo(map);
    })
    .catch(error => {
      console.log('Error fetching ISS location:', error);
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
      document.querySelectorAll('.carousel')[0].classList.remove("Hide");
      // Limit the photos to 10 for example
      var roverPhotos = roverPhotos.slice(0, 5);
      var photoUrls = new Array();

      roverPhotos.forEach((photo, index) => {

          const element = {
              photoUrl : photo.img_src,
              roverName : photo.rover.name,
              cameraName : photo.camera.full_name
            };

            photoUrls.push(element);

      });
      currentPhotoIndex = 0;
      localStorage.setItem('photoUrls', JSON.stringify(photoUrls));
      showSlide(currentPhotoIndex);
    })
    .catch(error => {
      document.querySelectorAll('.carousel')[0].classList.add("Hide");
      console.log('Error fetching rover photos:', error);
    });
};

var saveHistory = (rover, date) =>{  

  const element = {
    rover : rover,
    date : date
  };
  
  var history = JSON.parse(localStorage.getItem('history'));
  
  if (!Array.isArray(history)){
    history = Array();

  }
  
  if(history.length < 4 ){
     //save element in local storage
     history.push(element);
     localStorage.setItem('history', JSON.stringify(history));
     renderHistory();
  }
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
  var slideE1 = document.querySelectorAll('.slide');
  var imgE1 = document.createElement('img');
  var photoUrls = JSON.parse(localStorage.getItem('photoUrls'));

  imgE1.src = photoUrls[index].photoUrl;
  imgE1.alt = `${photoUrls[index].roverName} - ${photoUrls[index].cameraName}`;
  imgE1.classList.add('photo'); 
  imgE1.classList.add('d-block');
  imgE1.classList.add('w-100');// move the 'photo' class to the img element
  
  slideE1[0].replaceChild(imgE1, slideE1[0].childNodes[0]); // append img directly to photosContainer
};
  // Event listener for the rover form submission
  roverForm.addEventListener('submit', event => {
    event.preventDefault();

    carouselExampleControls.removeAttribute("hidden");
  
    var roverSelect = document.getElementById('roverSelect');
    var dateInput = document.getElementById('dateInput');

    var selectedRover = roverSelect.value;
    var selectedDate = dateInput.value;

    if(dayjs().isBefore(dayjs(selectedDate))){
      console.log('Error, wrong date');
      selectedDate = dayjs().format('YYYY-MM-DD');
      $('#exampleModal').modal('show');
      errorMessage.textContent = 'The date entered does not provide a valid response.';
    }  else{
      fetchRoverPhotos(selectedRover, selectedDate);      
      saveHistory(selectedRover, selectedDate);
    }
  });  

  hisBtn.on('click', '#historyButton', function (event) {
    var history = JSON.parse(localStorage.getItem('history'));
    historyELement = history[$(this).index()];
    fetchRoverPhotos(historyELement.rover, historyELement.date);
  });

  document.getElementById('nextButton').addEventListener('click', () => {
    currentPhotoIndex++;
    var photoUrls = JSON.parse(localStorage.getItem('photoUrls'));
    if (currentPhotoIndex == photoUrls.length) {
      currentPhotoIndex = 0;
    }
    showSlide(currentPhotoIndex);
  });

  document.getElementById('prevButton').addEventListener('click', () => {
    currentPhotoIndex--;
    console.log(currentPhotoIndex);
    var photoUrls = JSON.parse(localStorage.getItem('photoUrls'));
    if (currentPhotoIndex < 0) {
      currentPhotoIndex = photoUrls.length -1;
    }
    showSlide(currentPhotoIndex);
  });

  document.getElementById('deleteHistory').addEventListener('click', () =>{
    history = Array();
    localStorage.setItem('history', JSON.stringify(history));
    renderHistory();
  })

  document.getElementById('weatherInfo').addEventListener('click', () =>{
    fetchSpaceEvents();
    document.getElementById('hidePeopleSpace').classList.remove("Hide");
  })

  document.getElementById('hidePeopleSpace').addEventListener('click', () =>{
    var spaceInfo = document.getElementById('spaceInfo');
    spaceInfo.innerHTML = '';
    document.getElementById('hidePeopleSpace').classList.add("Hide");
  })


  // Call the function to fetch Mars weather on page load
  
  trackISSLocation();
  renderHistory();