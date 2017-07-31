/**
 * Created by RJ on 2016/4/16.
 */
var mapObject = {callFun:null, deviceList:{}};

export default class Map{
    constructor(){
        this.map = null;
        this.drawFeatureGroup = L.featureGroup();
        this.drawItems = null;
        // this.deviceList = {}

        this.curDevice = {type:'', id:-1};

        this.updateTime = -1;
        this.latlng = null;

        this.position = null;

        this.curMapData = null;
        this.layer = null;
        // this._callFun = null;

        this.markerPosList = []
        this.markerList = []

        this.IsDrawControl = false;
        this.myControl = null;
        this.deviceControl = null;
        this.activeBtn = null;
    }

    updateMap(data, option, callFun) {

        initCallFun(callFun);

        var options = {
            mapOffline: 0,
            mapType: "google",
            center: [31.239658843127756, 121.49971691534425],
            zoom: 16,
            minZoom: 10,
            maxZoom: 18,
            maxClusterRadius: 50,
            mapZoom: true
        }

        if (option) {
            options = Object.assign({}, options, option);
        }

        if (!document.getElementById(data.id)) {
            return;
        }

        if (!data || !data.latlng.lat || !data.latlng.lng) {
            this.latlng = options.center;
        } else {
            this.latlng = [data.latlng.lat, data.latlng.lng];
        }

        this.initMap(data, options);

        this.setMapView(data, options);
    }

    updateMapDevice(data, deviceData, callFun) {
        initCallFun(callFun);

        if (deviceData) {
            for (var key in deviceData) {
                mapObject.deviceList[key] = deviceData[key];
            }
        }
        this.createMarker(data);
    }

    mapPanTo(latlng) {
        if (!latlng || !latlng.lat || latlng.lng) {
            return;
        }

        this.map.panTo([latlng.lat, latlng.lng]);
    }

    initMap(data, option) {
        var mapOffline = option.mapOffline;
        if (this.map == null) {
            if (mapOffline == 0 || mapOffline == 1) {
                let options = {
                    id:data.id,
                    attributionControl: false,
                    zoomControl: false
                }

                if (mapOffline == 0 && option.mapType == 'baidu') {
                    options.crs = L.CRS.BEPSG3857;
                }

                this.map = L.map(data.id, options);

                if (option.mapZoom) {
                    L.control.zoom({
                        position: 'bottomright'
                    }).addTo(this.map);
                }

            } else if (mapOffline == 2) {
                this.map = L.map(data.id, {
                    id:data.id,
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

        this.map.on('moveend', mapMoveEnd);
    }

    setMapView(data, options) {

        if (this.map != null) {
            switch (options.mapOffline) {
                case 0:
                    this.onLineMap(options.mapType, options);
                    break;
                case 1:
                    this.offLineMap(options);
                    break;
                case 2:
                    this.staticPicture(data.map);
                    break;
            }

            this.customControl(data);

            this.markerControl(false, options);
        }
    }

    onLineMap(type, options) {
        var option = {maxZoom: options.maxZoom, minZoom: options.minZoom}

        this.map.setView(this.latlng, options.zoom);

        if (type == 'google') {
            L.tileLayer.chinaProvider('Google.Normal.Map', option).addTo(this.map);
            return;
        }

        if (type == 'gaoDe') {
            L.tileLayer.chinaProvider('GaoDe.Normal.Map', option).addTo(this.map);
            return;
        }

        if (type == 'baidu') {
            L.tileLayer.baiduLayer('Normal.Map', option).addTo(this.map);
            return;
        }

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', option).addTo(this.map);


        // return map;
    }

// addEventListener('resize', resizeHandler);
// function resizeHandler(event) {
//
// }
    offLineMap(options) {
        var option = {maxZoom: options.maxZoom, minZoom: options.minZoom, zoom: options.zoom}

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
        }).addTo(this.map);

        map.setView(this.latlng, option.zoom);
    }

    decimalToHex(d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

        while (hex.length < padding) {
            hex = "0" + hex;
        }
        return hex;
    }

    updateDeviceStatus (data) {
        var list = [0, 1, 2];
        var status = -1;
        if (!data || this.markerList.length <= 0) {
            return;
        }

        data.lamp && data.lamp.map(function (item) {
            var marker = this.getMarkerById('DEVICE', item.id);
            if (marker != null) {
                status = item.comm_status == 'Normal' && item.lamp_status == 'Normal' ? 2 : 0;
                status = status && item.brightness > 0 ? 1 : 0;
                marker.options.status = status;
                marker.setIcon(getCustomMarkerByDeviceType('DEVICE', status));
                // loadMarkerPopup(marker, item);
            }
        })

        data.controller && data.controller.map(function (item) {
            var cMarker = this.getMarkerById('CONTROLLER', item.id);
            if (cMarker != null) {
                status = item.comm_state == 'Normal' ? 1 : 0;
                marker.options.status = status;
                cMarker.setIcon(getCustomMarkerByDeviceType('CONTROLLER', status))
            }
        })

        data.intelligent && data.intelligent.map(function (item) {
            var iMarker = this.getMarkerById('ISTREETLIGHT', item.id);
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
            var chMarker = this.getMarkerById('CHARGER', item.id);
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
    }

    /**
     *  当前选中要操作设备
     * @param type
     * @param id
     */
    updateDevice (type, id) {
        this.curDevice.type = type;
        this.curDevice.id = id;
    }
    updateMouseOverStatus (type, id) {
        var marker = this.getMarkerById(type, id)
        marker && marker.setIcon(getCustomMarkerByDeviceType(type, 3, marker.options.digital))
    }

    updateMouseOutStatus (type, id) {
        var marker = this.getMarkerById(type, id)
        marker && marker.setIcon(getCustomMarkerByDeviceType(marker.options.type, marker.options.id, marker.options.digital));
    }

    staticPicture(data) {
        if (this.layer || !data) {
            return;
        }

        this.curMapData = data.data;

        var width = data.data.w;
        var height = data.data.h;

        var southWest = this.map.unproject([0, height], 2);
        var northEast = this.map.unproject([width, 0], 2);
        var imageBounds = new L.LatLngBounds(southWest, northEast);
        this.map.setMaxBounds(imageBounds);

        this.layer = L.imageOverlay(data.url + data.data.file, imageBounds).addTo(this.map);
    }

    clickHandler(event) {
    }

//__________________________________________________________________________________________________


     createMarker(list) {

        if (!list || list.length == 0) {
            return;
        }

        // markerPosList.concat(list);
         var _this = this
        list.map(function (data) {
            let marker = _this.getMarkerById(data.device_type, data.device_id);
            // let markerIndex = getMarkerIndexById(data.device_type, data.device_id)

            if (marker) {
                //     // removeMarker(marker)
                //     // markerList.splice(markerIndex);
            } else {
                _this.markerPosList.push(data);
                var device = getDevicesByTypeAndId(data.device_type, data.device_id);
                var labelInfo = device ? device.name : '';
                var newMarker = _this.drawMarker(data.device_type, data.device_id, L.latLng([data.lat, data.lng]), getCustomMarkerByDeviceType(data.device_type, 0, data.digital), data.digital);
                if (newMarker) {
                    _this.loadMarkerLabel(newMarker, labelInfo);

                    _this.drawItems && _this.drawItems.addLayer(newMarker);
                    _this.markerList.push(newMarker)
                }
            }
        })
    }


     getMarkerById(type, id) {
        for (var index in this.markerList) {
            if (this.markerList[index].options.type == type && this.markerList[index].options.id == id) {
                return this.markerList[index];
            }
        }

        return null;
    }

     delMarkerById(type, id) {
        var delIndex = -1;
        for (var index in this.markerList) {
            if (this.markerList[index].options.type == type && this.markerList[index].options.id == id) {
                delIndex = index;
                break;
            }
        }

        if (delIndex > -1) {
            this.markerList.splice(delIndex, 1)
        }
    }

     getMarkerDataById(type, id) {
        for (var x in this.markerPosList) {
            if (this.markerPosList[x].device_type == type && this.markerPosList[x].device_id == id) {
                return this.markerPosList[x];
            }
        }

        return null;
    }

     delMarkerDataById(type, id) {
        var delIndex = -1;
        for (var x in this.markerPosList) {
            if (this.markerPosList[x].device_type == type && this.markerPosList[x].device_id == id) {
                delIndex = x;
                break;
            }
        }

        if (delIndex > -1) {
            this.markerPosList.splice(delIndex, 1);
        }
    }

     addMarkerData(data) {
         this.markerPosList.push(data)
    }

     drawMarker(type, id, position, icon, digital) {
        // position = L.latLng(-100, 100)
        var marker = L.marker(position, {
            icon: icon,
            type: type,
            id: id,
            digital: digital,
            riseOnHover: true,
            draggable: true
        })
        // item.getLatLng();
        return marker;
    }

     removeMarker(marker) {
        if (marker) {
            marker.off('click', markerClick);
            marker.off('mouseover', markerOver);
            marker.off('mouseout', markerOut);
            if (this.drawItems.hasLayer(marker)) {
                this.drawItems.removeLayer(marker);
            }
        }

        marker = null;
    }


     loadMarkerLabel(marker, labelInfo) {
        if (marker == null) {
            return;
        }
        // if (!!popupInfo) {
        //     marker.bindPopup(popupInfo, {offset: [100, 50], className: 'controller-popup'}).openPopup();
        // }
        this.loadMarkerPopup(marker);
        this.loadMarkerMouseover(marker);
         this.loadMarkerDrag(marker);
        if (!!labelInfo) {
            marker.bindLabel(labelInfo, {noHide: true}).addTo(this.drawItems).showLabel();
        }
    }

     loadMarkerDrag(marker) {
        marker.on('dragstart', function () {
            marker.off("mouseover", markerOver);
            marker.off("mouseout", markerOut);
        })
        marker.on('dragend', this.markerDragEnd)
    }

     loadMarkerMouseover(marker) {
        marker.on('mouseover', markerOver);
    }

    markerDragEnd(event) {
        var marker = event.target;
        markerDragendHandler({
            id: marker.options.id,
            type: marker.options.type,
            latlng: marker.getLatLng()
        })

        marker.on("mouseover", markerOver);
    }

     loadMarkerPopup(marker) {
        marker.off('click', markerClick);
        marker.on('click', markerClick);
    }

     markerControl(IsAdd, options) {
        if (!this.map) {
            return;
        }

        if (!IsAdd) {
            // drawItems = L.markerClusterGroup({maxClusterRadius:options.maxClusterRadius});
            this.drawItems = L.featureGroup();
            this.map.addLayer(this.drawItems);
            return;
        }

         this.drawItems = L.featureGroup();
         this.map.addLayer(this.drawItems);

        if (this.IsDrawControl) {
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
        this.drawEvent();

        this.IsDrawControl = true;
    }

    drawEvent() {
        this.map.on('draw:created', function (e) {

            if (this.curDevice.id < 0) {
                markerHandler('error', $.i18n.prop('select_device'));

                return;
            }

            if (this.getMarkerDataById(this.curDevice.type, this.curDevice.id)) {
                markerHandler('error', $.i18n.prop('device_added'));
                return;
            }


            var type = e.layerType,
                marker = e.layer;
            marker.setIcon(getCustomMarkerByDeviceType(this.curDevice.type, 0));
            if (type === 'marker') {
            }

            marker.options.type = curDevice.type;
            marker.options.id = curDevice.id;

            var device = getDevicesByTypeAndId(this.curDevice.type, this.curDevice.id);
            var labelInfo = device ? device.name : '';
            this.loadMarkerLabel(marker, labelInfo);

            this.drawItems.addLayer(marker);
            this.markerList.push(marker);

            var latLng = marker.getLatLng();
            var addData = {device_id: this.curDevice.id, device_type: this.curDevice.type, lng: latLng.lng, lat: latLng.lat}
            this.curMapData ? (addData.map_id = this.curMapData.id) : ''
            this.addMarkerData(addData);

            markerHandler('add', addData);
        });
        //
        map.on('draw:edited', function (e) {
            var layers = e.layers;
            var editData = []
            layers.eachLayer(function (layer) {
                var editedMarker = layer;
                var editedLatLng = editedMarker.getLatLng();
                var markerData = this.getMarkerDataById(editedMarker.options.type, editedMarker.options.id)
                markerData.lng = editedLatLng.lng;
                markerData.lat = editedLatLng.lat;
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
                var markerData = this.getMarkerDataById(removeMarker.options.type, removeMarker.options.id)
                deletedData.push(markerData);

                this.delMarkerDataById(removeMarker.options.type, removeMarker.options.id);
                this.delMarkerById(removeMarker.options.type, removeMarker.options.id)
            })

            markerHandler('delete', deletedData);
        })
    }

    customControl(data) {
        return;
        if (!this.map || this.deviceControl) {
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
                    btn.addEventListener('click', toggleHandler);
                    if (item.id == data.deviceBtn.active) {
                        activeBtn = btn;
                    }
                })
                return container;
            }
        })

        this.deviceControl = new DeviceControl()
        this.deviceControl && this.map.addControl(this.deviceControl);
    }


    createPolygon() {
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

    clearMarker () {
        if (this.drawItems) {
            while (this.markerList.length > 0) {
                var marker = this.markerList.shift();
                this.removeMarker(marker);
            }
        }
    }
    destoryMap () {
        this.clearMarker();

        this.markerPosList = []
        this.curMapData = null;
        this.layer = null;

        this.map && this.map.hasLayer(this.drawItems) && this.map.removeLayer(this.drawItems);
        this.map && this.map.remove();
        this.map = null;

        this.deviceControl = null;
        this.IsDrawControl = false;
    }

    destory () {
        clearTimeout(this.updateTime);
        this.destoryMap();
    }
}

function mapMoveEnd(event) {

    var map = event.target;
    mapDragendHandler({
        latlng:map.getCenter()
    });
}

function markerOver(event) {
    var marker = event.target;
    marker.off("mouseover", markerOver);
    marker.on("mouseout", markerOut);

    var icon = getCustomMarkerByDeviceType(marker.options.type, 3, marker.options.digital)
    marker.setIcon(icon);
    markerMouseOverHandler({
        type: marker.options.type,
        id: marker.options.id,
    })
}

function markerOut(event) {
    var marker = event.target;
    marker.on("mouseover", markerOver);
    marker.off("mouseout", markerOut)
    var icon = getCustomMarkerByDeviceType(marker.options.type, marker.options.status, marker.options.digital)
    marker.setIcon(icon)
    markerMouseOutHandler({
        type: marker.options.type,
        id: marker.options.id,
    })
}

function markerClick(event) {
    var marker = event.target;
    markerClickHandler({
        type: marker.options.type,
        id: marker.options.id,
        x: event.originalEvent.clientX,
        y: event.originalEvent.clientY
    });
}

function toggleHandler(event) {
    if (mapObject.callFun != null && mapObject.callFun.toggleMap) {
        var id = event.target.id;
        if (id == 'leftBtn' || id == 'rightBtn') {
            id == 'leftBtn' ? mapObject.callFun.toggleMap('GLOBAL_MAP') : mapObject.callFun.toggleMap('LOCAL_MAP')
        } else {
            L.DomUtil.removeClass(activeBtn, 'active');
            activeBtn = event.target;
            L.DomUtil.addClass(activeBtn, 'active');
            mapObject.callFun.toggleMap(id);
        }
    }
}
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
                icon: '' + digital,
                color: getColorByStatus(status),
                digital: true
            })
        default:
            return L.AwesomeMarkers.icon({
                icon: '',
                color: getColorByStatus(status)
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

function getDevicesByTypeAndId(type, id) {
    var deviceList = mapObject.deviceList;
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

function initCallFun(callFun) {
    if(!callFun){
        return;
    }

    if(mapObject.callFun){
        mapObject.callFun = Object.assign({}, mapObject.callFun, callFun)
    }else{
        mapObject.callFun = callFun
    }
}

function mapDragendHandler(data){
    if(mapObject.callFun != null && mapObject.callFun.mapDragendHandler){
        mapObject.callFun.mapDragendHandler(data);
    }
}

function markerDragendHandler(data) {
    if (mapObject.callFun != null && mapObject.callFun.markerDragendHandler) {
        mapObject.callFun().markerDragendHandler(data);
    }
}

function markerMouseOverHandler(data) {
    if (mapObject.callFun != null && mapObject.callFun.markerMouseOverHandler) {
        mapObject.callFun.markerMouseOverHandler(data);
    }
}

function markerMouseOutHandler(data) {
    if (mapObject.callFun != null && mapObject.callFun.markerMouseOutHandler) {
        mapObject.callFun.markerMouseOutHandler(data);
    }
}

function markerClickHandler(data) {
    if (mapObject.callFun != null && mapObject.callFun.markerClickHandler) {
        mapObject.callFun.markerClickHandler(data);
    }
}

function markerHandler(id, data) {
    if (mapObject.callFun != null && mapObject.callFun.markerHandler) {
        mapObject.callFun.markerHandler(id, data)
    }
}