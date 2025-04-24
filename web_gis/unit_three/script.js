import { createMap, addMarker } from '../utility/map-utils.js';

let map;
const markers = [];
let currentQueryType = 'all';

const markerColors = {
  all: 'blue',
  worldwide: 'green',
  emergency: 'red'
};

const initialize = () => {
  map = createMap();
  
  $('#all-btn').on('click', () => { 
    currentQueryType = 'all';
    fetchData(currentQueryType);
  });
  
  $('#worldwide-btn').on('click', () => {
    currentQueryType = 'worldwide';
    fetchData(currentQueryType);
  });
  
  $('#emergency-btn').on('click', () => {
    currentQueryType = 'emergency';
    fetchData(currentQueryType);
  });
  
  $('#clear-btn').on('click', clearData);
};

const fetchData = (queryType = 'all') => {
  $('.query-btn').removeClass('active');
  $(`#${queryType}-btn`).addClass('active');
  
  $('#status').text('Loading data...');
  
  $.ajax({
    url: 'fetchData.php',
    method: 'GET',
    data: { type: queryType },
    dataType: 'json',
    success: (response) => {
      clearData();
      
      $('#status').html(`Showing <strong>${response.count}</strong> tweets for <strong>${queryType}</strong> query`);
      
      const color = markerColors[queryType] || 'blue';
      
      response.tweets.forEach(({ body, latitude, longitude, day, hour, min }) => {
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        
        if (!isFinite(lat) || !isFinite(lon)) {
          return;
        }
        
        const popupContent = `<strong>${body}</strong><br>Day ${day} Hour ${hour} Min ${min}`;
        const m = addMarker(map, lat, lon, popupContent, true, color);
        markers.push(m);
      });
    },
    error: (jqXHR, status, err) => {
      $('#status').text(`Error loading data: ${err}`);
    }
  });
};

const clearData = () => {
  markers.forEach(m => map.removeLayer(m));
  markers.length = 0;
  $('#status').text('');
};

$(document).ready(() => {
  initialize();
  fetchData('all');
});