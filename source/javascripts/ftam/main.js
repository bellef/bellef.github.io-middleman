const baseUrl = "https://foodtrucksaroundme.herokuapp.com"
// const baseUrl = "http://localhost:3000"
let map = null
let markersGroup = null

createMarker = (foodTruck) => {
  let marker = L.marker([foodTruck.latitude, foodTruck.longitude]).addTo(markersGroup)
  let markerPopUp =
    `
      <p>
        <h5>${foodTruck.name}</h5><br>
        ${foodTruck.food_items}
      </p>
      <p>
        ${foodTruck.address} (${foodTruck.location_description})<br>
        ${foodTruck.schedule}
      </p>
    `

  marker.bindPopup(markerPopUp)
}

showInfo = (message) => {
  let infoDisplayer = document.querySelector("div.alert-primary")

  infoDisplayer.innerHTML = message
  infoDisplayer.style.display = "block"
}

showWarning = (message) => {
  let warningDisplayer = document.querySelector("div.alert-warning")

  warningDisplayer.innerHTML = message
  warningDisplayer.style.display = "block"
}

removeFlashMessages = () => {
  let flashers = document.getElementsByClassName("alert")

  Array.from(flashers).forEach((flasher) => {
    flasher.style.display = "none"
  })
}

resetMarkers = (foodTrucks) => {
  if (foodTrucks.length) {
    map.panTo({ lat: foodTrucks[0].latitude, lng: foodTrucks[0].longitude })

    if (map.hasLayer(markersGroup)) // Remove old markers
      map.removeLayer(markersGroup)

    markersGroup = L.layerGroup() // Create new markers layer

    foodTrucks.forEach((foodTruck) => {
      createMarker(foodTruck)
    })
    markersGroup.addTo(map)
  } else { // No result
    showInfo("No result can be found, please try another location.")
  }
}

fetchFoodTrucks = (address, radius = null) => {
  let queryParameters = `?address=${address}`
  if (radius)
    queryParameters += `&radius_km=${radius}`

  fetch(baseUrl + queryParameters)
    .then(response => {
      if (!response.ok)
        throw Error("Woups, an error occured, please try contacting the administrator of the site.");
      return response.json()
    })
    .then(resetMarkers)
    .catch(error => showWarning(error))
}

handleSearch = (event) => {
  removeFlashMessages()
  let addressInput = document.getElementById("js-address-input").value
  let rangeInput = document.getElementById("js-range-input").value

  if (addressInput.length)
    fetchFoodTrucks(addressInput, rangeInput)
}

handleRangeChange = (event) => {
  const rangeValue = event.target.value
  const valueDisplayer = document.querySelector(".range-wrapper .range-value")

  valueDisplayer.innerHTML = rangeValue + " km"
}

initMap = () => {
  map = L.map("mapid", {
    center: [37.762036, -122.435137],
    zoom: 14,
    scrollWheelZoom: false
  })

  // Add tiles provider
  L.tileLayer(
    "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
    {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
      id: "mapbox.streets"
    }
  ).addTo(map);
}

document.addEventListener("DOMContentLoaded", () => {
  initMap()

  const rangeSlider = document.getElementById("js-range-input")
  rangeSlider.addEventListener("change", handleRangeChange)

  const searchBtn = document.getElementById("js-search-btn")
  searchBtn.addEventListener("click", handleSearch)
})

