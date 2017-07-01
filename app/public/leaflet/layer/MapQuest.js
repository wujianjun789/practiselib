function createMapLayer(mapObj, key) {
  var script = document.createElement('script');
  script.src = "http://www.mapquestapi.com/sdk/leaflet/v2.s/mq-map.js?key=" + key;
  script.onload = function () {
    var mapLayer = MQ.mapLayer();
    mapObj.addLayer(mapLayer);

    L.control.layers({
      'Map': mapLayer,
      'Dark': MQ.darkLayer(),
      'Light': MQ.lightLayer(),
      'Satellite': MQ.satelliteLayer(),
    }).addTo(mapObj);    
  };
  document.head.appendChild(script);
}