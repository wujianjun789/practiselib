/**
 * Created by a on 2017/8/1.
 */
import {getAssetModelList} from '../../api/asset'
import {intlFormat, getClassByModel} from '../../util/index'

let models=[

]

export const TreeData=[
    {
        "id": "deviceConfig",
        "name":"设备配置",
        "toggled": true,
        "active": true,
        "link": "/systemOperation/lampConCenter",
        "level":1,
        "children": [
            {
                "id": 'lampConCenter',
                "name":"灯集中控制器",
                "class":"icon_gateway",
                "active":true
            },
            {
                "id": 'singleLampCon',
                "name":"单灯控制器",
                "class":"icon_lc",
                "active":false
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

export let firstChild = {}
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
                    let child = {id:data.key, name:intlFormat(data.intl.name), class:getClassByModel(data.key), active:index==0?true:false};
                    if(index == 0){
                        firstChild = child;
                    }
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

// export function getModelNameById(id) {
//     return 'lcc';
// }