function createMapLayer(mapObj) {
  var normalm = L.tileLayer.chinaProvider('MapABC.Normal.Map',{maxZoom:18,minZoom:3});
  mapObj.addLayer(normalm);  
}