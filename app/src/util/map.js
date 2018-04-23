/**
 * Created by a on 2017/6/16.
 */
import {getMapConfig} from '../util/network';

let pattern = /[^\d{1,}\.\d{1,}|\d{1,}]/g;//输入数字和小数点
const numberValid = /^(-?\d+)(\.\d+)?$/;//是否是浮点数
export default class Map{
    constructor(){
        //地图
        this.id = "";
        this.map = null;
        this.options = {
            mapZoom: true
        }

        //地图设备容器
        this.drawItems = null;
        //地图中心点
        this.latlng = null;

        //静态地图
        this.layer = null;
         //静态地图数据
        this.curMapData = null;

        //当前要操作设备
        this.curDevice = {type:'', id:-1};

        this.updateTime = -1;

        //地图上设备信息
        this.deviceList = {}
        //marker数据
        this.markerPosList = []
        //marker
        this.markerList = []

        this.IsDrawControl = false;
        this.deviceControl = null;
        this.activeBtn = null;
        //marker是否可拖拽
        this.markerDraggable = false;

        this.mapDragendTimeout = 0;
        this.mapMoveendTimeout = 0;
        this.mapZoomendTimeout = 0;
        this.markerClickTimeout = 0;

        this.callFun = {};
    }

    updateMap(data, option, callFun) {
        let options = this.options;
        options = Object.assign({}, options, option);

        if (options.hasOwnProperty("mapOffline") && options.hasOwnProperty("mapType")) {
        }else {
            return getMapConfig(response=>{

                this.options = Object.assign({}, this.options, response);
                this.updateMap(data, option, callFun)
            }, error=>{
                throw error;
            })
        }

        if(option && option.hasOwnProperty("markerDraggable")) {
            this.markerDraggable = option.markerDraggable;
        }
        if (!document.getElementById(data.id)) {
            return false;
        }

        if (!data || !data.latlng || !numberValid.test(data.latlng.lat) || !numberValid.test(data.latlng.lng)) {
            this.latlng = options.center;
        } else {
            if(data.latlng.lat.toString().replace(pattern,'') && data.latlng.lng.toString().replace(pattern,'')){
                this.latlng = [data.latlng.lat, data.latlng.lng];
            }else{
                this.latlng = options.center;
            }
        }

        this.id = data.id;

        this.callFun = Object.assign({}, this.callFun, callFun);

        this.initMap(data, options);

        this.setMapView(data, options);
    }

    updateMapDevice(data, deviceData, callFun) {
        if(!this.drawItems){
            setTimeout(()=>this.updateMapDevice(data, deviceData, callFun), 33);
            return false;
        }

        this.callFun = Object.assign({}, this.callFun, callFun);
        this.deviceList = deviceData;

        this.createMarker(data);
    }

    mapPanTo(latlng) {
        if (!latlng || !numberValid.test(latlng.lat) || !numberValid.test(latlng.lng)) {
            return false;
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
        this.map.on('dragend', this.mapDragEnd, this);
        this.map.on('moveend', this.mapMoveEnd, this);
        this.map.on('zoomend', this.mapZoomEnd, this);
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
                default:
                    break;
            }
            this.customControl(data);
            this.markerControl(false, options);
        }
    }

    onLineMap(type, options) {
        var option = {maxZoom: options.maxZoom, minZoom: options.minZoom}

        if(this.latlng && this.latlng.length && (numberValid.test(this.latlng[0])) && numberValid.test(this.latlng[1])){
            this.map.setView(this.latlng, options.zoom);
        }

        if (type == 'google') {
            return L.tileLayer.chinaProvider('Google.Normal.Map', option).addTo(this.map);
        }

        if (type == 'gaoDe') {
            return L.tileLayer.chinaProvider('GaoDe.Normal.Map', option).addTo(this.map);
        }

        if (type == 'baidu') {
            return L.tileLayer.baiduLayer('Normal.Map', option).addTo(this.map);
        }

        if(type == 'bing'){
            let imagerySet = "CanvasLight";// AerialWithLabels | Birdseye | BirdseyeWithLabels | Road
            // let bing = new L.BingLayer("LfO3DMI9S6GnXD7d0WGs~bq2DRVkmIAzSOFdodzZLvw~Arx8dclDxmZA0Y38tHIJlJfnMbGq5GXeYmrGOUIbS2VLFzRKCK0Yv_bAl6oe-DOc", {type: imagerySet});
            // let bing = new L.BingLayer("Akd2MEZfAV6OL9yS-Ll85Lfu3hhIi6U2K_GKrI35dPch9iyMPmAao6ZryOATSkC5", Object.assign({}, option,{type: imagerySet}));
            // bing.addTo(this.map);
            return L.tileLayer.bing({
                bingMapsKey: "Akd2MEZfAV6OL9yS-Ll85Lfu3hhIi6U2K_GKrI35dPch9iyMPmAao6ZryOATSkC5",
                imagerySet: imagerySet,
                culture: 'zh-CN',
                minZoom: option.minZoom
            }).addTo(this.map);
        }

        if(type == 'arcGis'){
            L.esri.basemapLayer("Streets", Object.assign({}, option, {hideLogo:true})).addTo(this.map);
            return new L.esri.FeatureLayer({
                url:"https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0/",
                style: function () {
                    return {color:"#70ca49", weight:2};
                }
            }).addTo(this.map);
        }

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', option).addTo(this.map);
    }

    offLineMap(options) {
        var option = {maxZoom: options.maxZoom, minZoom: options.minZoom, zoom: options.zoom}

        L.TileLayer.prototype.getTileUrl = function (tilePoint) {

            return L.Util.template(this._url, L.extend({
                s: this._getSubdomain(tilePoint),
                z: tilePoint.z,
                x: this.decimalToHex(tilePoint.x, 8),
                y: this.decimalToHex(tilePoint.y, 8)
            }, this.options));
        }

        L.tileLayer('offlineMap/L{z}/R{y}/C{x}.png', {
            attribution: 'Map data &copy;',
            maxZoom: option.maxZoom,
            minZoom: option.minZoom
        }).addTo(this.map);

        this.map.setView(this.latlng, option.zoom);
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
        let list = [0, 1, 2];
        let status = -1;
        if (!data || this.markerList.length <= 0) {
            return false;
        }
        
        data.lamp && data.lamp.map(function (item) {
            let marker = this.getMarkerById('DEVICE', item.id);
            if (marker != null) {
                status = item.comm_status == 'Normal' && item.lamp_status == 'Normal' ? 2 : 0;
                status = status && item.brightness > 0 ? 1 : 0;
                marker.options.status = status;
                marker.setIcon(Map.getCustomMarkerByDeviceType('DEVICE', status));
                // loadMarkerPopup(marker, item);
            }
        })

        data.controller && data.controller.map(function (item) {
            let cMarker = this.getMarkerById('CONTROLLER', item.id);
            if (cMarker != null) {
                status = item.comm_state == 'Normal' ? 1 : 0;
                cMarker.options.status = status;
                cMarker.setIcon(Map.getCustomMarkerByDeviceType('CONTROLLER', status))
            }
        })

        data.intelligent && data.intelligent.map(function (item) {
            let iMarker = this.getMarkerById('ISTREETLIGHT', item.id);
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
                iMarker.options.status = status;
                iMarker.setIcon(Map.getCustomMarkerByDeviceType('ISTREETLIGHT', status))
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

                chMarker.options.status = status;
                chMarker.setIcon(Map.getCustomMarkerByDeviceType('CHARGER', status))
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
        marker && marker.setIcon(Map.getCustomMarkerByDeviceType(type, 3, marker.options.digital))
    }

    updateMouseOutStatus (type, id) {
        var marker = this.getMarkerById(type, id)
        marker && marker.setIcon(Map.getCustomMarkerByDeviceType(marker.options.type, marker.options.id, marker.options.digital));
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
         let _this = this
        list.map(function (data) {
            let marker = _this.getMarkerById(data.device_type, data.device_id);
            // let markerIndex = getMarkerIndexById(data.device_type, data.device_id)

            if (marker) {
                //     // removeMarker(marker)
                //     // markerList.splice(markerIndex);
            } else {
                if(numberValid.test(data.lat) && numberValid.test(data.lng) && data.lat.toString().replace(pattern,'') && data.lng.toString().replace(pattern,'')){

                    _this.markerPosList.push(data);
                    let device = _this.getDevicesByTypeAndId(_this.id, data.device_type, data.device_id);
                    let labelInfo = '';
                    if(data.IsCircleMarker && device){
                        labelInfo = device.detail;
                    }else if(device){
                        labelInfo = device.name;
                    }

                    let newMarker = _this.drawMarker(data.IsCircleMarker, data.device_type, data.device_id, L.latLng([data.lat, data.lng]), Map.getCustomMarkerByDeviceType(data.device_type, 0, data.digital), data.digital);
                    if (newMarker) {
                        _this.loadMarkerLabel(newMarker, labelInfo, data.IsCircleMarker);
                        _this.drawItems && _this.drawItems.addLayer(newMarker) && _this.markerList.push(newMarker);
                    }
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

     getMarkerDataById(type, id) {
        for (var x in this.markerPosList) {
            if (this.markerPosList[x].device_type == type && this.markerPosList[x].device_id == id) {
                return this.markerPosList[x];
            }
        }

        return null;
    }

     addMarkerData(data) {
         this.markerPosList.push(data)
    }

     drawMarker(IsCircleMarker, type, id, position, icon, digital) {
        // position = L.latLng(-100, 100)
         let marker = null;
         if(IsCircleMarker){
              marker = L.circleMarker(position,{
                  type: type,
                  mapId: this.id,
                  id: id,
                  radius: 50,
                  stroke: false,
                  fillColor: '#00bcff',
                  fillOpacity: 0.7,

                  IsCircleMarker: IsCircleMarker
              });
         }else{
             marker = L.marker(position, {
                 icon: icon,
                 type: type,
                 mapId:this.id,
                 id: id,
                 digital: digital,
                 riseOnHover: true,
                 draggable: this.markerDraggable,

                 IsCircleMarker: IsCircleMarker
             });
         }

        return marker;
    }

     loadMarkerLabel(marker, labelInfo, IsCircleMarker) {
        if (marker == null) {
            return;
        }

        this.loadMarkerPopup(marker);
        this.loadMarkerMouseover(marker);
         this.loadMarkerDrag(marker);
        if (!!labelInfo && this.drawItems) {
            if(IsCircleMarker){
                marker.bindTooltip(labelInfo, {className: 'circle-marker-label', offset: [-52,-0], direction: 'right', permanent: true, opacity:1}).openTooltip();
            }else{
                marker.bindTooltip(labelInfo, {offset: [6,2], direction: 'right', permanent: true, opacity:1}).openTooltip();
            }
        }
    }

     loadMarkerDrag(marker) {
        marker.on('dragstart', function () {
            marker.off("mouseover", this.markerOver, this);
            marker.off("mouseout", this.markerOut, this);
        })
        marker.on('dragend', this.markerDragEnd, this)
    }

    loadMarkerMouseover(marker) {
        marker.on('mouseover', this.markerOver, this);
    }

     loadMarkerPopup(marker) {
        marker.off('click', this.markerClick, this);
        marker.on('click', this.markerClick, this);
    }
//---------------------------------------------------控制容器-------------------------------------------------------------------
     markerControl(IsAdd, options) {
         if (!this.map) {
            return;
         }

         this.drawItems = L.featureGroup();
         this.drawItems.addTo(this.map);
         if(!IsAdd){
             return;
         }

         if (this.IsDrawControl) {
            return;
         }

        let drawControl = new L.Control.Draw({
            position: 'topright',
            draw: {
                rectangle: false,
                polyline: false,
                polygon: false,
                circle: false,
                marker: true
            },
            edit: {
                featureGroup: this.drawItems,
                edit: true,
                remove: true
            }
        })

        drawControl && this.map.addControl(drawControl);
        this.drawEvent();

        this.IsDrawControl = true;
    }

    customControl(data) {
        // return;
        // if (!this.map || this.deviceControl) {
        //     return;
        // }
        //
        // let DeviceControl = L.Control.extend({
        //     options: {
        //         position: 'topleft'
        //     },
        //     initialize: function (options) {
        //         L.Util.setOptions(this, options);
        //     },
        //     onAdd: function (map) {
        //         var container = L.DomUtil.create('div', 'custom-toggle-container');
        //
        //         data && data.deviceBtn && data.deviceBtn.data.map(function (item) {
        //             var className = 'custom-toggle-button  ' + (item.id == data.deviceBtn.active ? 'active' : '');
        //
        //             var btn = L.DomUtil.create('button', className, container)
        //             btn.id = item.id;
        //             btn.innerText = item.name;
        //             L.DomEvent.on(btn, 'click', this.toggleHandler);
        //             if (item.id == data.deviceBtn.active) {
        //                 this.activeBtn = btn;
        //             }
        //         })
        //         return container;
        //     }
        // })
        //
        // this.deviceControl = new DeviceControl();
        // this.deviceControl && this.map.addControl(this.deviceControl);
    }

    //----------------------------------------------事件处理------------------------------------------------------------
    drawEvent() {
        this.map.on(L.Draw.Event.CREATED, function (e) {

            if (this.curDevice.id < 0) {
                this.markerHandler(this.id, 'error', $.i18n.prop('select_device'));
                return;
            }

            if (this.getMarkerDataById(this.curDevice.type, this.curDevice.id)) {
                this.markerHandler(this.id, 'error', $.i18n.prop('device_added'));
                return;
            }


            var type = e.layerType,
                marker = e.layer;
            marker.setIcon(Map.getCustomMarkerByDeviceType(this.curDevice.type, 0));
            if (type === 'marker') {
            }

            marker.options.type = this.curDevice.type;
            marker.options.id = this.curDevice.id;

            var device = this.getDevicesByTypeAndId(this.id, this.curDevice.type, this.curDevice.id);
            var labelInfo = device ? device.name : '';
            this.loadMarkerLabel(marker, labelInfo);

            this.drawItems.addLayer(marker);
            this.markerList.push(marker);

            var latLng = marker.getLatLng();
            var addData = {device_id: this.curDevice.id, device_type: this.curDevice.type, lng: latLng.lng, lat: latLng.lat}
            this.curMapData ? (addData.map_id = this.curMapData.id) : ''
            this.addMarkerData(addData);

            this.markerHandler(this.id, 'add', addData);
        });
        //
        this.map.on(L.Draw.Event.EDITED, function (e) {
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

            this.markerHandler(this.id, 'edit', editData);
        });

        this.map.on(L.Draw.Event.DELETED, function (e) {
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

            this.markerHandler(this.id, 'delete', deletedData);
        })
    }
    
    mapDragEnd(event) {
        let map = event.target;
        map.off("dragend", this.mapDragEnd, this);
        let bounds = map.getBounds();
        this.mapDragendTimeout && clearTimeout(this.mapDragendTimeout);
        this.mapDragendTimeout = setTimeout(()=>{
            this.mapDragendHandler({
                mapId:map.options.id,
                latlng:map.getCenter(),
                zoom: map.getZoom(),
                bounds: bounds,
                distance: bounds._southWest.distanceTo(bounds._northEast)
            });
        }, 33);
    }
    
    mapMoveEnd(event) {
        let map = event.target;
        //map.off("moveend", this.mapMoveEnd, this);
        let bounds = map.getBounds();
        this.mapMoveendTimeout && clearTimeout(this.mapMoveendTimeout);
        this.mapMoveendTimeout = setTimeout(()=>{
            this.mapMoveendHandler({
                mapId:map.options.id,
                latlng:map.getCenter(),
                zoom: map.getZoom(),
                bounds: bounds,
                distance: bounds._southWest.distanceTo(bounds._northEast)
            });
        }, 33);
    }

    mapZoomEnd(event) {
        // this.clearMarker();
        let map = event.target;
        //this.map.off('zoomend', this.mapZoomEnd, this);
        let bounds = map.getBounds();
        this.mapZoomendTimeout && clearTimeout(this.mapZoomendTimeout);
        this.mapZoomendTimeout = setTimeout(()=>{
            this.mapZoomendHandler({
                mapId: map.options.id,
                latlng:map.getCenter(),
                zoom: map.getZoom(),
                bounds: bounds,
                distance: bounds._southWest.distanceTo(bounds._northEast)
            })
        }, 33)
    }

    markerClick(event) {
        var marker = event.target;

        this.markerClickTimeout && clearTimeout(this.markerClickTimeout);
        this.markerClickTimeout = setTimeout(()=>{
            this.markerClickHandler({
                mapId: marker.options.mapId,
                type: marker.options.type,
                id: marker.options.id,
                x: event.originalEvent.clientX,
                y: event.originalEvent.clientY,
                latlng: marker.getLatLng()
            });
        }, 33)
    }

    markerOver(event) {
        var marker = event.target;
        marker.off("mouseover", this.markerOver, this);
        marker.on("mouseout", this.markerOut, this);
        //var icon = getCustomMarkerByDeviceType(marker.options.type, 3, marker.options.digital)
        //marker.setIcon(icon);
        this.markerMouseOverHandler({
            mapId: marker.options.mapId,
            type: marker.options.type,
            id: marker.options.id,
        })
    }

    markerOut(event) {
        var marker = event.target;
        marker.on("mouseover", this.markerOver, this);
        marker.off("mouseout", this.markerOut, this)
        //var icon = getCustomMarkerByDeviceType(marker.options.type, marker.options.status, marker.options.digital)
        //marker.setIcon(icon)
        this.markerMouseOutHandler({
            type: marker.options.type,
            id: marker.options.id,
            mapId: marker.options.mapId
        })
    }

    markerDragEnd(event) {
        var marker = event.target;
        marker.off("dragend", this.markerDragEnd);
        this.markerDragendHandler({
            mapId:marker.options.mapId,
            id: marker.options.id,
            type: marker.options.type,
            latlng: marker.getLatLng()
        })

        marker.on("mouseover", this.markerOver, this);
    }

    toggleHandler(event) {
        if (this.callFun != null && this.callFun.toggleMap) {
            var id = event.target.id;
            if (id == 'leftBtn' || id == 'rightBtn') {
                this.callFun.toggleMap.call(null, id=='leftBtn'?'GLOBAL_MAP':'LOCAL_MAP')
            } else {
                L.DomUtil.removeClass(this.activeBtn, 'active');
                this.activeBtn = event.target;
                L.DomUtil.addClass(this.activeBtn, 'active');
                this.callFun.toggleMap.call(null, id);
            }
        }
    }

    //---------------------------------------------回调处理-------------------------------------------------------------
    mapZoomendHandler(data) {
        if(this.callFun.mapZoomendHandler){
            this.callFun.mapZoomendHandler.call(null, data);
        }
    }

    mapMoveendHandler(data){
        if(this.callFun.mapMoveendHandler){
            this.callFun.mapMoveendHandler.call(null, data);
        }
    }

    mapDragendHandler(data){
        if(this.callFun.mapDragendHandler){
            this.callFun.mapDragendHandler.call(null, data);
        }
    }

    markerDragendHandler(data) {
        if (this.callFun.markerDragendHandler) {
            this.callFun.markerDragendHandler.call(null, data);
        }
    }

    markerMouseOverHandler(data) {
        if (this.callFun.markerMouseOverHandler) {
            this.callFun.markerMouseOverHandler.call(null, data);
        }
    }

    markerMouseOutHandler(data) {
        if (this.callFun.markerMouseOutHandler) {
            this.callFun.markerMouseOutHandler.call(null, data);
        }
    }

   markerClickHandler(data) {
        if (this.callFun.markerClickHandler) {
            this.callFun.markerClickHandler.call(null, data);
        }
    }

    markerHandler(mapId, id, data) {
        if (this.callFun.markerHandler) {
            this.callFun.markerHandler.apply(null, [id, data])
        }
    }
    //-------------------------------------------------辅助函数-----------------------------------------------------------
    /**
     * @param type设备类型
     * @param status设备状态
     */
    static markerIcon = {'CONTROLLER':'lightbulb', 'DEVICE':'lightbulb', 'ISTREETLIGHT':'intelligent',
        'CHARGER':'charger', 'POLE':'lightbulb', 'PLC':'plc', 'SCREEN':'mobile-phone'}
    static getCustomMarkerByDeviceType(type, status, digital) {
        if(type == 'DIGITAL'){
            L.AwesomeMarkers.icon({icon: '' + digital, color:Map.getColorByStatus(status)});
        }

        return L.AwesomeMarkers.icon({icon: Map.markerIcon[type]?Map.markerIcon[type]:'lightbulb', color:Map.getColorByStatus(status)});
    }

    static markerColor = ['red', 'green', 'cadetblue', 'darkblue'];
    static getColorByStatus(status) {
        let color = 'red'
        if(status>-1 && status<Map.markerColor.length){
            color = Map.markerColor[status];
        }else{
            throw new Error('not found status');
        }

        return color;
    }

    static deviceList = {'DEVICE':'lamp', 'PLC':'plc', 'SCREEN':'screen', 'CHARGER':'charger', 'POLE':'pole',
        'GATEWAY':'gateway', 'XES':'xes', 'SENSOR':'sensor', 'DIGITAL':'digital', 'CONTROLLER':'lc'};
    getDevicesByTypeAndId(mapId, type, id) {
        let proType = Map.deviceList[type]
        let list = this.deviceList[proType];

        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                return list[i]
            }
        }

        return null;
    }

    //_______________________________________________销毁_______________________________________________________
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

    removeMarker(marker) {
        if (marker) {
            marker.off('click', this.markerClick, this);
            marker.off('mouseover', this.markerOver, this);
            marker.off('mouseout', this.markerOut, this);
            if (this.drawItems.hasLayer(marker)) {
                this.drawItems.removeLayer(marker);
            }
        }

        marker = null;
    }

    clearMarker() {
        if (this.drawItems) {
            while (this.markerList.length > 0) {
                var marker = this.markerList.shift();
                this.removeMarker(marker);
            }
        }
    }

    destroyMap() {
        this.markerPosList = []
        this.curMapData = null;
        this.layer = null;

        if(this.map){
            this.map.off('dragend', this.mapDragEnd, this);
            this.map.off('moveend', this.mapMoveEnd, this);
            this.map.off('zoomend', this.mapZoomEnd, this);
            this.map.hasLayer(this.drawItems) && this.map.removeLayer(this.drawItems);
            this.map.remove();
            this.map = null;
        }

        this.deviceControl = null;
        this.IsDrawControl = false;
    }

    destroy() {
        clearTimeout(this.updateTime);
        clearTimeout(this.mapZoomendTimeout);
        clearTimeout(this.mapDragendTimeout);
        clearTimeout(this.mapMoveendTimeout);
        this.clearMarker();
        this.destroyMap();
    }
}