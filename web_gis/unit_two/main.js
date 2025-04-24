import { createMap, addMarker, normalizeDate } from '../utility/map-utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const map = createMap();
  const markers = [];

  fetch('./blueplaques.json')
    .then(res => res.json())
    .then(data => {
      data.slice(1).forEach(item => {
        const title = item[''];
        const location = item['__1'];
        const unveiler = item['__2'];
        const rawDate = item['__3'];
        const description = item['__7'];
        const eastingStr = item['__5'];
        const northingStr = item['__6'];

        if (!location || !unveiler || rawDate == null || !description || !eastingStr || !northingStr) {
          return;
        }

        const easting = Number(eastingStr);
        const northing = Number(northingStr);
        if (isNaN(easting) || isNaN(northing)) return;

        const osPt = new OSRef(easting, northing);
        const llPt = osPt.toLatLng();
        llPt.OSGB36ToWGS84();
        const lat = llPt.lat;
        const lon = llPt.lon ?? llPt.lng;
        if (lat == null || lon == null) return;

        const date = normalizeDate(rawDate);

        const marker = addMarker(map, lat, lon, {
          title,
          location,
          unveiler,
          date,
          description
        }, true, 'blue');

        markers.push(marker);
      });

      if (markers.length) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds());
      }
    })
    .catch(err => console.error('Error loading plaques:', err));
});