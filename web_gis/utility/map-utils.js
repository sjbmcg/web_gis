/**
 * Map Utilities
 */

// the normalization of data was really confusing 
export function normalizeDate(raw) {
  let date = String(raw || '').trim();
  date = date.replace(/[-–—]+/g, ' ').trim();
  const cutoff = 2000 % 100;
  date = date.replace(/['''](\d{2})/, (_, yy) => {
    // Had to dive into regex docs to figure out how to grab that apostrophe year
    // like '98 and then extract just the numbers. The _ is the whole match and
    // yy gives me just the digits I needed for the year conversion
    const num = Number(yy);
    const base = num <= cutoff ? 2000 : 1900;
    return String(base + num);
  });
  date = date.replace(/\s+/g, ' ').trim();
  return date;
}

export function createMap() {
  const map = L.map('mapdiv', {
    center: [0, 0],
    zoom: 2,
    maxZoom: 18
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data ©OpenStreetMap contributors, CC-BY-SA',
    maxZoom: 18
  }).addTo(map);

  return map;
}

export function addMarker(map, lat, lng, plaqueData, useCircleMarker = false, markerColor = 'blue') {
  let marker;

  if (useCircleMarker) {
    marker = L.circleMarker([lat, lng], {
      radius: 8,
      fillColor: markerColor,
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  } else {
    marker = L.marker([lat, lng]);
  }
  // A quick fix i was running out of time to make it more generic
  if (typeof plaqueData === 'string') {
    marker.bindPopup(`${plaqueData}`, { className: 'plaque-popup' });
  } else if (plaqueData && typeof plaqueData === 'object') {
    try {
      const { title = 'No Title', location = 'Unknown', unveiler = 'Unknown', date: rawDate = '', description = 'No description' } = plaqueData;
      const date = normalizeDate(rawDate);

      const popupHtml = `
        <strong>${title}</strong><br>
        <b>Location:</b> ${location}<br>
        <b>Unveiler:</b> ${unveiler}<br>
        <b>Date:</b> ${date}<br>
        <b>Description:</b> ${description}
      `;

      marker.bindPopup(popupHtml, { className: 'plaque-popup' });
    } catch (err) {
      console.warn('Could not bind popup data:', err);
    }
  }

  marker.addTo(map);
  return marker;
}


export function addPolygon(map) {
  const latlngs = [
    [53.8060, -1.5570],
    [53.8060, -1.5520],
    [53.8030, -1.5520],
    [53.8030, -1.5570]
  ];

  const options = {
    color: 'blue',
    fillColor: '#f03',
    fillOpacity: 0.1,
    weight: 2
  };

  const polygon = L.polygon(latlngs, options);
  polygon.bindPopup("University Area");

  if (map) {
    polygon.addTo(map);
  }

  return polygon;
}
