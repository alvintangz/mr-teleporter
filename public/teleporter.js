var latPrevious = "";
var longPrevious = "";

async function teleportGet() {
  try {
    const response = await axios.get('/api/fetch');
    let enabled = response.data.enabled;
    let longitude = response.data.longitude;
    let latitude = response.data.latitude;
    console.log(response.data);
    if(enabled == "true" && !longitude && !latitude) {
      document.getElementById('publicScreen').style.display = "none";
      document.getElementById('loadingPrompt').style.display = "block";
      document.getElementById('street-view').style.display = "none";
    } else if(enabled == "true" && longitude && latitude && (latPrevious !== latitude) && (longPrevious !== longitude)) {
      latPrevious = latitude;
      longPrevious = longitude;
      panorama.setPosition(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)));
      document.getElementById('publicScreen').style.display = "none";
      document.getElementById('loadingPrompt').style.display = "none";
      document.getElementById('street-view').style.display = "block";
    } else if (enabled == "false") {
      document.getElementById('publicScreen').style.display = "block";
      document.getElementById('loadingPrompt').style.display = "none";
      document.getElementById('street-view').style.display = "none";
      longitude = "";
      latitude = "";
    }
    //setInterval(teleportGet, 5000);
  } catch (error) {
    console.log(error)
    console.log("Error has occured with teleporting fetching.");
  }
}
setInterval(teleportGet, 4000);

// From: https://gist.github.com/demonixis/5188326
/**
 * Toggle fullscreen function who work with webkit and firefox.
 * @function toggleFullscreen
 * @param {Object} event
 */
function toggleFullscreen(event) {
  var element = document.body;

  if (event instanceof HTMLElement) {
    element = event;
  }

  var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

  element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () { return false; };
  document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () { return false; };

  isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
}