import { createMap, addMarker, addPolygon } from '../utility/map-utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const map = createMap();
  const group = L.featureGroup().addTo(map);

  fetch('./unit_one_coordinates/coordinates.json')
    .then(res => res.json())
    .then(coords => {
      coords.forEach(({ name, latitude, longitude, description }) => {
        const popup = `${name} : ${description}`;
        const marker = addMarker(map, latitude, longitude, popup,false,);
        group.addLayer(marker);
      });
    })
    .catch(err => console.error('Error fetching coordinates:', err));

  const polygon = addPolygon();
  group.addLayer(polygon);

  group.once('layeradd', () => {
    map.fitBounds(group.getBounds());
  });

  console.log('Map application initialized with markers + polygon in one FeatureGroup');
});
