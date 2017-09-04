/** Created By ChrisWen
 *  17/08/31
 *  These Two functions is provide initData to smartLight-smartLightPole.
 */

export const sysInitData = {
    add(curType, domainList) {
        return {
            id: '',
            name: '',
            model: curType ? curType.title : "",
            modelId: curType ? curType.id : "",
            domain: domainList.value,
            domainId: domainList.options.length ? domainList.options[domainList.index].id : "",
            lng: "",
            lat: ""
        }
    },
    update(latlng, data, selectDevice) {
        return {
            id: data ? data.id : null,
            name: data ? data.name : null,
            model: data ? getModelTypesNameById(model, data.type) : "",
            modelId: data ? data.type : null,
            domain: selectDevice.domainName,
            domainId: selectDevice.domainId,
            lng: latlng.lng,
            lat: latlng.lat
        }
    },
    smartLight: [
        {
            id: 0,
            field: "name",
            title: "路灯名称"
        }, {
            id: 1,
            field: "domainName",
            title: "域"
        }, {
            id: 2,
            field: "lightCount",
            title: "灯"
        }, {
            id: 3,
            field: "camera",
            title: "摄像头"
        }, {
            id: 5,
            field: "screen",
            title: "显示屏"
        }, {
            id: 6,
            field: "electricStation",
            title: "充电桩"
        }
    ],
    smartLightPole: []
}


