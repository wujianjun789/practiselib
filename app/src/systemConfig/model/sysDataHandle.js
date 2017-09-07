/** Created By ChrisWen
 *  17/08/31
 *  Provide a model that has mostInit functions and data.
 */
export const sysDataHandle = {
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
    //provide data that used to init
    init(data) {
        return {
            //index: 0,
            value: data.length ? data[0].name : "",
            options: data
        }
    },
    //provide data that used to selectDomain in <Select change/>
    select(event, dataList) {
        let index = event.target.selectedIndex;
        return {
            //index: index,
            value: dataList.options[index].name
        }
    },
    /**
     *  ↓↓↓↓↓ StaticDataSource ↓↓↓↓↓
     */
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
        },
    ],
    smartLightPole: [],
    equipmentSelectList: [{
        id: 1,
        title: 'light',
        value: '灯'
    }, {
        id: 2,
        title: 'screen',
        value: '显示屏'
    }, {
        id: 3,
        title: 'camera',
        value: '摄像头'
    }, {
        id: 4,
        title: 'chargeStake',
        value: '充电桩'
    }],
    equipmentList: [{
        name: '摄像头1',
        added: true
    }, {
        name: '摄像头2',
        added: true
    }, {
        name: '摄像头3',
        added: false
    }]
}