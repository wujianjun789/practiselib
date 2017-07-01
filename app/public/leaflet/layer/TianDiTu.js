function createMapLayer(mapObj) {
  var normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map',{maxZoom:18,minZoom:3}),
    normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion',{maxZoom:18,minZoom:3}),
    imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map',{maxZoom:18,minZoom:3}),
    imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion',{maxZoom:18,minZoom:3});

  var normal = L.layerGroup([normalm,normala]),
    image = L.layerGroup([imgm,imga]);

  var baseLayers = {
    "地图":normal,
    "影像":image,
  },
    overlayLayers = {};

  mapObj.addLayer(normal);
  L.control.layers(
    baseLayers,
    overlayLayers)
  .addTo(mapObj);
}