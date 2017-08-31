/**
 * Created by a on 2017/7/3.
 */
import {getAssetModelList} from '../api/asset'
import {intlFormat, getClassByModel} from '../util/index'

let models=[

]

export const TreeData=[
    {
        "id": "model",
        "name":"资产模型",
        "toggled": true,
        "active": true,
        "link": "/assetManage/model",
        "level":1,
        "children": [
            {
                "id": 11,
                "name":"灯集中控制器",
                "class":"icon_light_control",
                "active":true
            },
            {
                "id": 12,
                "name":"LED灯",
                "class":"icon_led_light",
                "active":false
            },{
                "id": 13,
                "name":"PLC回路控制器",
                "class":"icon_plc_control",
                "active":false
            },
            {
                "id": 14,
                "name":"智慧电表",
                "class":"icon_ammeter",
                "active":false
            },
            {
                "id": 15,
                "name":"灯杆",
                "class":"icon_pole",
                "active":false
            },
            {
                "id": 16,
                "name":"广告屏",
                "class":"icon_screen",
                "active":false
            },
            {
                "id": 17,
                "name":"数据采集仪",
                "class":"icon_collect",
                "active":false
            }
        ]
    },
    {
        "id": "statistics",
        "name":"资产统计",
        "toggled": false,
        "active": true,
        "link": "/assetManage/statistics",
        "level": 1,
        "children": [
            {
                "id": 11,
                "name":"灯集中控制器",
                "class":"icon_light_control",
                "active":true
            },
            {
                "id": 12,
                "name":"LED灯",
                "class":"icon_led_light",
                "active":false
            }

        ]
    }
]

export let first_child = {}
export function getModelData(cb) {
    if(models && models.length>0){
        cb && cb();
        return
    }

    getAssetModelList(response=>{
        models = response;
        TreeData.map(item=>{
            if(item.children){
                item.children = [];
                response.map((data, index)=>{
                    let child = {id:data.key, name:intlFormat(data.intl.name), class:getClassByModel(data.key), active:false,link:getLinkByModel(item.id, data.key)};
                    if(index==0 ){
                        item.link = "/assetManage/"+item.id+"/"+data.key;
                    }
                    item.children.push(child)
                })
            }
        })

        cb && cb();
    });
}

function getLinkByModel(parentId, key) {
    switch(key){
        case 'lcc':
            return '/assetManage/'+parentId+'/lcc';
        case 'lc':
            return '/assetManage/'+parentId+'/lc';
        case 'sensor':
            return '/assetManage/'+parentId+'/sensor';
        case 'ammeter':
            return 'icon_ammeter';
        case 'pole':
            return 'icon_pole';
        case 'screen':
            return '/assetManage/'+parentId+'/screen';
        case 'collect':
            return 'icon_collect'
        default:
            return 'icon_led_light';
    }
}

export function getModelList() {
    let list = []
    for(let key in models){
        let model = models[key]
        list.push({id:model.key, name:intlFormat(model.intl.name)})
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
    let model = getModelById(id)
    if(model){
        return intlFormat(model.intl.name);
    }

    return "";
}

export function getModelProps(id) {
    let model = getModelById(id)
    let list = []
    for(var i=0;i<model.props.length;i++){
        let prop = model.props[i];
        list.push(intlFormat(model.intl.props[prop]))
    }

    return list;
}

export function getModelTypes(id) {
    let model = getModelById(id)
    let list = []
    for(var i=0;i<model.types.length;i++){
        let type = model.types[i];
        list.push({type:type, detail:intlFormat(model.intl.types[type])})
    }
    return list;
}

export function getModelDefaults(id) {
    let model = getModelById(id)
    let list = [];
    list.push({field:"type", title:"型号"})
    for(var i in model.defaults.props) {
        let props = model.defaults.props[i]; 
        list.push({field:props, title:intlFormat(model.intl.props[props])})
    }
    return list;
}

export function getModelDefaultsValues(id) {
    let model = getModelById(id);
    let list = [];
    for(var key in model.defaults.values) {
        list.push(Object.assign({},{type:key}, model.defaults.values[key])); 
    }
    return list;
}