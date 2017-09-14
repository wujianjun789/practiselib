/** Created By ChrisWen
 *  17/08/31
 *  Provide a model that has mostInit functions and data.
 */

import { TreeData, getModelData, getModelNameById, getModelTypesById, getModelTypesNameById } from '../../data/systemModel';
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
            index: 0,
            value: data.length ? data[0].name : "",
            options: data
        }
    },
    //provide data that used to selectDomain in <Select change/>
    select(event, dataList) {
        let index = event.target.selectedIndex;
        // console.log('dataList-value', dataList);
        return {
            index: index,
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
            field: "lcCount",
            title: "灯"
        }, {
            id: 3,
            field: "cameraCount",
            title: "摄像头"
        }, {
            id: 5,
            field: "screenCount",
            title: "显示屏"
        }, {
            id: 6,
            field: "chargePoleCount",
            title: "充电桩"
        },
    ],
    smartLightPole: [],
    equipmentSelectList: {
        value: '',
        index: 0,
        options: [{
            id: 1,
            title: 'light',
            value: '灯',
            name: '灯'
        }, {
            id: 2,
            title: 'screen',
            value: '显示屏',
            name: '显示屏'
        }, {
            id: 3,
            title: 'camera',
            value: '摄像头',
            name: '摄像头'
        }, {
            id: 4,
            title: 'chargeStake',
            value: '充电桩',
            name: '充电桩'
        }, {
            id: 5,
            title: 'sensor',
            value: '传感器',
            name: '传感器'
        }]
    }
}