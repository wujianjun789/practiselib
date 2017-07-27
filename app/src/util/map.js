/**
 * Created by RJ on 2016/4/16.
 */
var map = null;
var drawFeatureGroup = L.featureGroup();
var drawItems = null;
var position = null;

var deviceList = {}

var _callFun = null;
var curDevice = { type: '', id: -1 };

var updateTime = -1;
var latlng = null;

Window.prototype.mapObject = {
    key:'map'
};

export function updateMap(data, option) {

    var options = {
        mapOffline: 0,
        mapType: "google",
        center: [31.239658843127756, 121.49971691534425],
        zoom: 16,
        minZoom: 10,
        maxZoom: 18,
        maxClusterRadius: 50,
        mapZoom:true
    }

    if(option){
        options = Object.assign({}, options, option);
    }

    if (!document.getElementById('map')) {
        return;
    }

    if (!data || !data.latlng.lat || !data.latlng.lng) {
        latlng = options.center;
    } else {
        latlng = [data.latlng.lat, data.latlng.lng];
    }

    initMap(data, options);

    setMapView(data, options);
}

function initMap(data, option) {
    var mapOffline = option.mapOffline;
    if (map == null) {
        if (mapOffline == 0 || mapOffline == 1) {
            let options = {
                attributionControl: false,
                zoomControl: false
            }

            if (mapOffline == 0 && option.mapType == 'baidu') {
                options.crs = L.CRS.BEPSG3857;
            }

            map = L.map("map", options);

            if(option.mapZoom){
                L.control.zoom({
                    position: 'bottomright'
                }).addTo(map);
            }

        } else if (mapOffline == 2) {
            map = L.map('map', {
                center: [0, 0],
                zoom: 2,
                minZoom: 1,
                maxZoom: 4,
                crs: L.CRS.Simple,
                attributionControl: false,
                zoomControl: false
            });
        }
        
    }
}

function setMapView(data, options) {

    if (map != null) {
        switch (options.mapOffline) {
            case 0:
                onLineMap(options.mapType, options);
                break;
            case 1:
                offLineMap(options);
                break;
            case 2:
                staticPicture(data.map);
                break;
        }

        customControl(data);

        markerControl(false, options);
    }
}

export function updateMapDevice(data, deviceData, callFun) {
    _callFun = callFun;

    if (deviceData) {
        for (var key in deviceData) {
            deviceList[key] = deviceData[key];
        }
    }

    createMarker(data);
}

export function mapPanTo(latlng) {
    if(!latlng || !latlng.lat || latlng.lng){
        return;
    }

    map.panTo([latlng.lat, latlng.lng]);
}

var stateTime = -1;
export function updateDeviceStatus(data) {
    var list = [0, 1, 2];
    var status = -1;
    // stateTime = setTimeout(function () {
    if (!data || markerList.length <= 0) {
        return;
    }

    data.lamp && data.lamp.map(function (item) {
        var marker = getMarkerById('DEVICE', item.id);
        if (marker != null) {
            status = item.comm_status == 'Normal' && item.lamp_status == 'Normal' ? 2 : 0;
            status = status && item.brightness > 0 ? 1 : 0;
            marker.options.status = status;
            marker.setIcon(getCustomMarkerByDeviceType('DEVICE', status));
            // loadMarkerPopup(marker, item);
        }
    })

    data.controller && data.controller.map(function (item) {
        var cMarker = getMarkerById('CONTROLLER', item.id);
        if (cMarker != null) {
            status = item.comm_state == 'Normal' ? 1 : 0;
            marker.options.status = status;
            cMarker.setIcon(getCustomMarkerByDeviceType('CONTROLLER', status))
        }
    })

    data.intelligent && data.intelligent.map(function (item) {
        var iMarker = getMarkerById('ISTREETLIGHT', item.id);
        if (iMarker != null) {
            if (item.lamp.comm_status == 'Normal'
                && item.lamp.lamp_status == 'Normal') {
                if (item.hasOwnProperty('screen') && item.screen) {
                    if (item.screen.comm_state == 'Normal') {
                        status = 2;
                    } else {
                        status = 0;
                    }
                } else {
                    status = 2;
                }
            } else {
                status = 0;
            }

            status = status && item.lamp.brightness > 0 ? 1 : 0
            marker.options.status = status;
            iMarker.setIcon(getCustomMarkerByDeviceType('ISTREETLIGHT', status))
        }
    })

    data.charger && data.charger.map(function (item) {
        var chMarker = getMarkerById('CHARGER', item.id);
        if (chMarker != null) {
            switch (item.status) {
                case 'Charging':
                    status = 1
                    break;
                case 'Abnormal':
                    status = 0
                    break;
                default:
                    status = 2;
                    break;
            }

            marker.options.status = status;
            chMarker.setIcon(getCustomMarkerByDeviceType('CHARGER', status))
        }
    })
    // }, 33)
}

/**
 *  当前选中要操作设备
 * @param type
 * @param id
 */
export function updateDevice(type, id) {
    curDevice.type = type;
    curDevice.id = id;
}

export function updateMouseOverStatus(type, id) {
    var marker = getMarkerById(type, id)
    marker && marker.setIcon(getCustomMarkerByDeviceType(type, 3, marker.options.digital))
}

export function updateMouseOutStatus(type, id) {
    var marker = getMarkerById(type, id)
    marker && marker.setIcon(getCustomMarkerByDeviceType(marker.options.type, marker.options.id, marker.options.digital));
}

function onLineMap(type, options) {
    var option = { maxZoom: options.maxZoom, minZoom: options.minZoom }

    map.setView(latlng, options.zoom);

    if (type == 'google') {
        L.tileLayer.chinaProvider('Google.Normal.Map', option).addTo(map);
        return;
    }

    if (type == 'gaoDe') {
        L.tileLayer.chinaProvider('GaoDe.Normal.Map', option).addTo(map);
        return;
    }

    if (type == 'baidu') {
        L.tileLayer.baiduLayer('Normal.Map', option).addTo(map);
        return;
    }

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', option).addTo(map);


    // return map;
}

// addEventListener('resize', resizeHandler);
// function resizeHandler(event) {
//
// }

function offLineMap(options) {
    var option = { maxZoom: options.maxZoom, minZoom: options.minZoom, zoom: options.zoom }

    L.TileLayer.prototype.getTileUrl = function (tilePoint) {

        return L.Util.template(this._url, L.extend({
            s: this._getSubdomain(tilePoint),
            z: tilePoint.z,
            x: decimalToHex(tilePoint.x, 8),
            y: decimalToHex(tilePoint.y, 8)
        }, this.options));
    }

    L.tileLayer('offlineMap/L{z}/R{y}/C{x}.png', {
        attribution: 'Map data &copy;',
        maxZoom: option.maxZoom,
        minZoom: option.minZoom
    }).addTo(map);

    map.setView(latlng, option.zoom);
}

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }
    return hex;
}

var curMapData = null;
var layer = null;
function staticPicture(data) {
    if (layer || !data) {
        return;
    }

    curMapData = data.data;

    var width = data.data.w;
    var height = data.data.h;

    var southWest = map.unproject([0, height], 2);
    var northEast = map.unproject([width, 0], 2);
    var imageBounds = new L.LatLngBounds(southWest, northEast);
    map.setMaxBounds(imageBounds);

    layer = L.imageOverlay(data.url + data.data.file, imageBounds).addTo(map);
}

function clickHandler(event) {
}

//__________________________________________________________________________________________________
/**
 * @param type设备类型
 * @param status设备状态
 */
function getCustomMarkerByDeviceType(type, status, digital) {

    var color = '';
    switch (type) {
        case 'CONTROLLER':
            return L.AwesomeMarkers.icon({
                icon: 'sitemap',
                color: getColorByStatus(status)
            });
        case 'DEVICE':
            return L.AwesomeMarkers.icon({
                icon: 'lightbulb',
                color: getColorByStatus(status)
            });
        case 'ISTREETLIGHT':
            return L.AwesomeMarkers.icon({
                icon: 'intelligent',
                color: getColorByStatus(status),
                linkImg: true
            });
        case 'CHARGER':
            return L.AwesomeMarkers.icon({
                icon: 'charger',
                color: getColorByStatus(status),
                linkImg: true
            })
        case 'DIGITAL':
            return L.AwesomeMarkers.icon({
                icon: ''+digital,
                color: getColorByStatus(status),
                digital: true
            })
        default:
            return L.AwesomeMarkers.icon({
                icon:'',
                color:getColorByStatus(status)
            })
    }

}

function getColorByStatus(status) {
    var color = 'red'
    switch (status) {
        case 0:
            color = 'red'
            break;
        case 1:
            color = 'green';
            break;
        case 2:
            color = 'cadetblue';
            break;
        case 3:
            color = 'darkblue';
            break;
    }

    return color;
}

var markerPosList = []

function createMarker(list) {

    if (!list || list.length == 0) {
        return;
    }

    // markerPosList.concat(list);
    list.map(function (data) {
        let marker = getMarkerById(data.device_type, data.device_id);
        // let markerIndex = getMarkerIndexById(data.device_type, data.device_id)

        if (marker) {
            //     // removeMarker(marker)
            //     // markerList.splice(markerIndex);
        } else {
            markerPosList.push(data);
            var device = getDevicesByTypeAndId(data.device_type, data.device_id);
            var labelInfo = device ? device.name : '';
            var newMarker = drawMarker(data.device_type, data.device_id, L.latLng([data.y, data.x]), getCustomMarkerByDeviceType(data.device_type, 0, data.digital), data.digital);
            if(newMarker){
                loadMarkerLabel(newMarker, labelInfo);

                drawItems && drawItems.addLayer(newMarker);
                markerList.push(newMarker)
            }
        }
    })
}

function getDevicesByTypeAndId(type, id) {
    let list = [];
    switch (type) {
        case 'DEVICE':
            list = deviceList.lamp;
            break;
        case 'CONTROLLER':
            list = deviceList.controller;
            break;
        case 'ISTREETLIGHT':
            list = deviceList.intelligent;
            break;
        case 'CHARGER':
            list = deviceList.charger;
            break;
        case 'DIGITAL':
            list = deviceList.digital;
            break;
    }

    for (var i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            return list[i]
        }
    }

    return null;
}

function getMarkerById(type, id) {
    for (var index in markerList) {
        if (markerList[index].options.type == type && markerList[index].options.id == id) {
            return markerList[index];
        }
    }

    return null;
}

function delMarkerById(type, id) {
    var delIndex = -1;
    for (var index in markerList) {
        if (markerList[index].options.type == type && markerList[index].options.id == id) {
            delIndex = index;
            break;
        }
    }

    if (delIndex > -1) {
        markerList.splice(delIndex, 1)
    }
}

function getMarkerDataById(type, id) {
    for (var x in markerPosList) {
        if (markerPosList[x].device_type == type && markerPosList[x].device_id == id) {
            return markerPosList[x];
        }
    }

    return null;
}

function delMarkerDataById(type, id) {
    var delIndex = -1;
    for (var x in markerPosList) {
        if (markerPosList[x].device_type == type && markerPosList[x].device_id == id) {
            delIndex = x;
            break;
        }
    }

    if (delIndex > -1) {
        markerPosList.splice(delIndex, 1);
    }
}

function addMarkerData(data) {
    markerPosList.push(data)
}

var markerList = []

function drawMarker(type, id, position, icon, digital) {
    // position = L.latLng(-100, 100)
    var marker = L.marker(position, { icon: icon, type: type, id: id, digital:digital, riseOnHover:true, draggable:true })
    // item.getLatLng();
    return marker;
}

export function clearMarker() {
    if (drawItems) {
        while (markerList.length > 0) {
            var marker = markerList.shift();
            removeMarker(marker);
        }
    }
}

function removeMarker(marker) {
    if (marker) {
        marker.off('click', mapObject.markerClick);
        marker.off('mouseover', mapObject.markerOver);
        marker.off('mouseout', mapObject.markerOut);
        if (drawItems.hasLayer(marker)) {
            drawItems.removeLayer(marker);
        }
    }

    marker = null;
}


function loadMarkerLabel(marker, labelInfo) {
    if (marker == null) {
        return;
    }
    // if (!!popupInfo) {
    //     marker.bindPopup(popupInfo, {offset: [100, 50], className: 'controller-popup'}).openPopup();
    // }
    loadMarkerPopup(marker);
    loadMarkerMouseover(marker);
    loadMarkerDrag(marker);
    if (!!labelInfo) {
        marker.bindLabel(labelInfo, { noHide: true }).addTo(drawItems).showLabel();
    }
}

function loadMarkerDrag(marker) {
    marker.on('dragstart', function () {
        marker.off("mouseover", mapObject.markerOver);
        marker.off("mouseout", mapObject.markerOut);
    })
    marker.on('dragend', mapObject.markerDragEnd)
}

function loadMarkerMouseover(marker) {
    marker.on('mouseover', mapObject.markerOver);
}

mapObject.markerDragEnd = function (event) {
    var marker = event.target;
    markerDragendHandler({
        id: marker.options.id,
        type: marker.options.type,
        latlng: marker.getLatLng()
    })

    marker.on("mouseover", mapObject.markerOver);
}

mapObject.markerOver = function (event) {
    var marker = event.target;
    marker.off("mouseover", mapObject.markerOver);
    marker.on("mouseout", mapObject.markerOut);
    marker.setIcon(getCustomMarkerByDeviceType(marker.options.type, 3, marker.options.digital));
    markerMouseOverHandler({
        type: marker.options.type,
        id: marker.options.id,
    })
}

mapObject.markerOut = function (event) {
    var marker = event.target;
    marker.on("mouseover", mapObject.markerOver);
    marker.off("mouseout", mapObject.markerOut)
    marker.setIcon(getCustomMarkerByDeviceType(marker.options.type, marker.options.status, marker.options.digital))
    markerMouseOutHandler({
        type: marker.options.type,
        id: marker.options.id,
    })
}

function loadMarkerPopup(marker) {
    marker.off('click', mapObject.markerClick);
    marker.on('click', mapObject.markerClick);
}

mapObject.markerClick = function (event) {
    var marker  = event.target;
    markerClickHandler({
        type: marker.options.type,
        id: marker.options.id,
        x: event.originalEvent.clientX,
        y: event.originalEvent.clientY
    });
}

var IsDrawControl = false;
function markerControl(IsAdd, options) {
    if (!map) {
        return;
    }

    if (!IsAdd) {
        // drawItems = L.markerClusterGroup({maxClusterRadius:options.maxClusterRadius});
        drawItems = L.featureGroup();
        map.addLayer(drawItems);
        return;
    }

    drawItems = L.featureGroup();
    map.addLayer(drawItems);

    if (IsDrawControl) {
        return;
    }

    var drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
            rectangle: false,
            polyline: false,
            polygon: false,
            circle: false,
            marker: true
        },
        edit: {
            featureGroup: drawItems,
            edit: true,
            remove: true
        }
    })

    drawControl && map.addControl(drawControl);
    drawEvent();

    IsDrawControl = true;
}

function drawEvent() {
    map.on('draw:created', function (e) {

        if (curDevice.id < 0) {
            markerHandler('error', $.i18n.prop('select_device'));

            return;
        }

        if (getMarkerDataById(curDevice.type, curDevice.id)) {
            markerHandler('error', $.i18n.prop('device_added'));
            return;
        }


        var type = e.layerType,
            marker = e.layer;
        marker.setIcon(getCustomMarkerByDeviceType(curDevice.type, 0));
        if (type === 'marker') {
        }

        marker.options.type = curDevice.type;
        marker.options.id = curDevice.id;

        var device = getDevicesByTypeAndId(curDevice.type, curDevice.id);
        var labelInfo = device ? device.name : '';
        loadMarkerLabel(marker, labelInfo);

        drawItems.addLayer(marker);
        markerList.push(marker);

        var latLng = marker.getLatLng();
        var addData = { device_id: curDevice.id, device_type: curDevice.type, x: latLng.lng, y: latLng.lat }
        curMapData ? (addData.map_id = curMapData.id) : ''
        addMarkerData(addData);

        markerHandler('add', addData);
    });
    //
    map.on('draw:edited', function (e) {
        var layers = e.layers;
        var editData = []
        layers.eachLayer(function (layer) {
            var editedMarker = layer;
            var editedLatLng = editedMarker.getLatLng();
            var markerData = getMarkerDataById(editedMarker.options.type, editedMarker.options.id)
            markerData.x = editedLatLng.lng;
            markerData.y = editedLatLng.lat;
            editData.push(markerData);
        });

        markerHandler('edit', editData);
    });

    map.on('draw:deleted', function (e) {
        var layers = e.layers;
        var deletedData = []
        layers.eachLayer(function (layer) {
            var removeMarker = layer;
            var removeLatLng = removeMarker.getLatLng();
            var markerData = getMarkerDataById(removeMarker.options.type, removeMarker.options.id)
            deletedData.push(markerData);

            delMarkerDataById(removeMarker.options.type, removeMarker.options.id);
            delMarkerById(removeMarker.options.type, removeMarker.options.id)
        })

        markerHandler('delete', deletedData);
    })
}

function markerDragendHandler(data) {
    if(_callFun != null &&　_callFun.markerDragendHandler){
        _callFun.markerDragendHandler(data);
    }
}

function markerMouseOverHandler(data) {
    if(_callFun != null && _callFun.markerMouseOverHandler){
        _callFun.markerMouseOverHandler(data);
    }
}

function markerMouseOutHandler(data) {
    if(_callFun != null && _callFun.markerMouseOutHandler){
        _callFun.markerMouseOutHandler(data);
    }
}

function markerClickHandler(data) {
    if (_callFun != null && _callFun.markerClickHandler) {
        _callFun.markerClickHandler(data);
    }
}

function markerHandler(id, data) {
    if (_callFun != null && _callFun.markerHandler) {
        _callFun.markerHandler(id, data)
    }
}

function lampBrightnessChange(id, mode, targetId, value) {
    if (_callFun != null && _callFun.lampBrightnessChange) {
        _callFun.lampBrightnessChange.apply(null, [id, mode, targetId, value]);
    }
}

var myControl = null;
var deviceControl = null;
var activeBtn = null;
function customControl(data) {
return;
        if (!map || deviceControl) {
            return;
        }

        var DeviceControl = L.Control.extend({
            options: {
                position: 'topleft'
            },
            initialize: function (options) {
                L.Util.setOptions(this, options);
            },
            onAdd: function (map) {
                var container = L.DomUtil.create('div', 'custom-toggle-container');

                data && data.deviceBtn && data.deviceBtn.data.map(function (item) {
                    var className = 'custom-toggle-button  ' + (item.id == data.deviceBtn.active ? 'active' : '');

                    var btn = L.DomUtil.create('button', className, container)
                    btn.id = item.id;
                    btn.innerText = item.name;
                    btn.addEventListener('click', mapObject.toggleHandler);
                    if (item.id == data.deviceBtn.active) {
                        activeBtn = btn;
                    }
                })
                return container;
            }
        })

        deviceControl = new DeviceControl()
        deviceControl && map.addControl(deviceControl);
}

mapObject.toggleHandler = function (event) {
    if (_callFun != null && _callFun.toggleMap) {
        var id = event.target.id;
        if (id == 'leftBtn' || id == 'rightBtn') {
            id == 'leftBtn' ? _callFun.toggleMap('GLOBAL_MAP') : _callFun.toggleMap('LOCAL_MAP')
        } else {
            L.DomUtil.removeClass(activeBtn, 'active');
            activeBtn = event.target;
            L.DomUtil.addClass(activeBtn, 'active');
            _callFun.toggleMap(id);
        }
    }
}

function createPolygon() {
    var circle = L.circle(position, 1500, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(map);


    var polygon = L.polygon([
        [39.8, 116],
        [39.9, 116.3],
        [40, 116.1]
    ]).addTo(map)
}

export function destoryMap() {
    clearMarker();

    markerPosList = []
    curMapData = null;
    layer = null;

    map && map.hasLayer(drawItems) && map.removeLayer(drawItems);
    map && map.remove();
    map = null;

    deviceControl = null;
    IsDrawControl = false;
}

export function destory() {
    clearTimeout(updateTime);
    clearTimeout(stateTime);
    destoryMap();
}