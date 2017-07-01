function createMapLayer(mapObj) {
  var normalm = L.tileLayer.chinaProvider('GaoDe.Normal.Map',{maxZoom:18,minZoom:3}),
      imgm = L.tileLayer.chinaProvider('GaoDe.Satellite.Map',{maxZoom:18,minZoom:3}),
      imga = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion',{maxZoom:18,minZoom:3});

  var normal = L.layerGroup([normalm]),
      image = L.layerGroup([imgm,imga]);

  var baseLayers = {
      "地图":normal,
      "影像":image,
  }

  mapObj.addLayer(normal);
  L.control.layers(
    baseLayers,
    null)
  .addTo(mapObj);
}