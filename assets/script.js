var apiKey = 'qHqc0M7bu2zPLS268h6g49uEUPPzQ6LT13FYybRA';

var spaceContainer = document.getElementById('spaceContainer');
var roverForm = document.getElementById('roverForm');
var photosContainer = document.getElementById('photosContainer');
var dateInputEl = $('#dateInput');
var hisBtn = $('.historyCard');
var currentPhotoIndex = 0;
var errorMessage = document.getElementById('errorMessage');

// Function to fetch Mars weather data
var fetchSpaceEvents = () => {
  var apiUrl = 'http://api.open-notify.org/astros.json';

  // Fetch for astronauts API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      var astronauts = data.people;
      
      var spaceInfo = document.getElementById('spaceInfo');
      spaceInfo.innerHTML = '';
      
      var astronautsE1 = document.createElement('div');
      astronautsE1.classList.add('astronauts');
      
      astronauts.forEach(astronaut => {
        var astronautE1 = document.createElement('div');
        astronautE1.classList.add('astronaut');
        
        var nameE1 = document.createElement('span');
        nameE1.textContent = 'Name: ' + astronaut.name;
        
        var craftE1 = document.createElement('span');
        craftE1.textContent = 'Craft: ' + astronaut.craft;
        
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
    saveHistory(selectedRover, selectedDate);
    fetchRoverPhotos(selectedRover, selectedDate);
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
  // Call the function to fetch Mars weather on page load
  renderHistory();
  fetchSpaceEvents();