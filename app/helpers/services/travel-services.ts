const GOOGLE_PLACES_API_KEY = "YOUR_GOOGLE_PLACES_API_KEY";
const OPENWEATHERMAP_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
const SKYSCANNER_API_KEY = "YOUR_SKYSCANNER_API_KEY";
const AMADEUS_API_KEY = "YOUR_AMADEUS_API_KEY";
const FOURSQUARE_CLIENT_ID = "YOUR_FOURSQUARE_CLIENT_ID";
const FOURSQUARE_CLIENT_SECRET = "YOUR_FOURSQUARE_CLIENT_SECRET";
const MAPBOX_ACCESS_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN";
const UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY";

export const fetchGooglePlaces = async () => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+New+York&key=${GOOGLE_PLACES_API_KEY}`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const fetchOpenWeatherMap = async () => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${OPENWEATHERMAP_API_KEY}`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const fetchSkyscanner = async () => {
  try {
    const response = await fetch(
      `https://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/US/USD/en-US/SFO/Anywhere/anytime/anytime?apiKey=${SKYSCANNER_API_KEY}`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const fetchAmadeus = async () => {
  try {
    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/urls/checkin-links?airline=LH&language=EN&airport=MUC&apikey=${AMADEUS_API_KEY}`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const fetchFoursquare = async () => {
  try {
    const response = await fetch(
      `https://api.foursquare.com/v2/venues/explore?near=New+York&query=coffee&limit=10&client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20240101`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const fetchMapbox = async () => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const fetchWikipedia = async () => {
  try {
    const response = await fetch(
      "https://en.wikipedia.org/api/rest_v1/page/summary/New_York"
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const fetchUnsplash = async () => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
