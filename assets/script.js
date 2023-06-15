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
  var selectedDate = dateInputEl.val();
  var apiUrl = `https://api.nasa.gov/DONKI/GST?startDate=${selectedDate}&endDate=${selectedDate}&api_key=${apiKey}`;

  // Fetch for space events API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      var events = data;
      var spaceInfo = document.getElementById('spaceInfo')
      spaceContainer.innerHTML = '';

      if (events && events.length > 0) {
        events.forEach(event => {
          var eventE1 = document.createElement('div');
          eventE1.classList.add('event');

          var typeE1 = document.createElement('span');
          typeE1.classList.add('event-type');
          typeE1.textContent = event.eventType;

          var dateE1 = document.createElement('span');
          dateE1.classList.add('event-date');
          dateE1.textContent = event.startDate;

          var descriptionE1 = document.createElement('span');
          descriptionE1.classList.add('event-description');
          descriptionE1.textContent = event.notes;

          eventE1.appendChild(typeE1);
          eventE1.appendChild(dateE1);
          eventE1.appendChild(descriptionE1);
          spaceInfo.appendChild(eventE1);
        });
      } else {
        console.log('No space events found');
      }
    })
    .catch(error => {
      console.log('Error fetching space events:', error);
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
      document.querySelectorAll('.slide').innerHTML = '';

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
  document.querySelectorAll('.slide').innerHTML = '';

  var slideE1 = document.createElement('div');
  slideE1.classList.add('slide');
  var imgE1 = document.createElement('img');
  var photoUrls = JSON.parse(localStorage.getItem('photoUrls'));

  imgE1.src = photoUrls[index].photoUrl;
  imgE1.alt = `${photoUrls[index].roverName} - ${photoUrls[index].cameraName}`;

  imgE1.classList.add('photo'); // move the 'photo' class to the img element
  slideE1.appendChild(imgE1);
  photosContainer.replaceChild(slideE1, photosContainer.childNodes[0]); // append img directly to photosContainer
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