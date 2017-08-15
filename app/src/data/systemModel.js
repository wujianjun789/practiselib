/**
 * Created by a on 2017/8/1.
 */
import {getAssetModelList} from '../api/asset'
import {intlFormat, getClassByModel} from '../util/index'

let models=[

]

export const TreeData=[
    {
        "id": "deviceConfig",
        "name":"设备配置",
        "toggled": true,
        "active": true,
        "link": "/systemOperation/config",
        "level":1,
        "children": [
            {
                "id": 'lcc',
                "name":"灯集中控制器",
                "class":"icon_light_control",
                "active":true
            },
            {
                "id": 'lc',
                "name":"单灯控制器",
                "class":"icon_single_lamp_control",
                "active":false
            }
        ]
    },
    {
        "id":"controlStrategy",
        "name":"控制策略",
        "toggled": false,
        "active": true,
        "link":"/systemOperation/strategy",
        "level":1,
        "children":[
            {
                "id":'timeTable',
                "name":"时间表",
                "class":"icon_time_strategy",
                "active":false,
                "link":"/systemOperation/strategy/timeTable"
            },
            {
                "id":'sensor',
                "name":"传感器",
                "class":"icon_sensor_strategy",
                "active":false,
                "link":"/systemOperation/strategy/sensor"
            },
            {
                "id":'latlng',
                "name":"经纬度",
                "class":"icon_latlng_strategy",
                "active":false,
                "link":"/systemOperation/strategy/latlng"
            }
        ]

    },
    {
        "id": "serviceMonitor",
        "name":"服务监控",
        "toggled": false,
        "active": true,
        "link": "/systemOperation",
        "level": 1
    }
]

export function getModelData(model, cb) {
    // if(models && models.length>0){
    //     cb && cb();
    //     return
    // }
    getAssetModelList(response=>{
        models = response;
        TreeData.map(item=>{
            if(item.id == "deviceConfig"){
                let curModel = getModelById(model);
                if(curModel){
                    item.link = "/systemOperation/config/"+curModel.key;
                }
                item.children = [];
                response.map((data, index)=>{
                    let child = {id:data.key, name:intlFormat(data.intl.name), class:getClassByModel(data.key), active:data.key==model?true:false, link:getLinkByModel(data.key)};
                    item.children.push(child)
                })
            }
        })

        cb && cb();
    });
}

export function getModelList() {
    let list = []
    for(let key in models){
        let model = models[key]
        list.push({id:model.key, title:intlFormat(model.intl.name), value:intlFormat(model.intl.name)})
    }

    return list;
}

export function getModelById(id) {
    for(let key in models){
        if(models[key].key == id){
            return models[key];
        }
    }

    return null;
}

export function getModelNameById(id) {
    let model = getModelById(id);
    if(model){
        return intlFormat(model.intl.name);
    }

    return null;
}

function getLinkByModel(key) {
    switch(key){
        case 'lcc':
            return '/systemOperation/config/lcc';
        case 'lc':
            return '/systemOperation/config/lc';
        case 'plc':
            return 'icon_plc_control';
        case 'ammeter':
            return 'icon_ammeter';
        case 'pole':
            return 'icon_pole';
        case 'screen':
            return 'icon_screen';
        case 'collect':
            return 'icon_collect'
        default:
            return 'icon_led_light';
    }
}