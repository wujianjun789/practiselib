/**
 * Created by a on 2017/8/24.
 */
import { getAssetModelList } from '../api/asset';
import {getModelConfig} from '../util/network';

import { intlFormat, getClassByModel, transformKey } from '../util/index';

import lodash from 'lodash';

let models = [];
let modelConfig = [];

export const TreeData = [
  {
    id: 'statistics',
    name: 'lightManage.Statistics',
    toggled: false,
    active: true,
    link: '/light/statistics',
    level: 1,
    children: []
  },
  {
    id: 'map',
    name: 'lightManage.map',
    toggled: false,
    active: true,
    link: '/light/map',
    level: 1,
    children: []
  },
  {
    id: 'list',
    name: 'lightManage.list',
    toggled: false,
    active: true,
    link: '/light/list',
    level: 1,
    children: [
     /* {
        id: 'lc',
        name: 'lightManage.list.singleLamp',
        class: 'icon_lc',
        active: false,
        link: '/light/list'
      },
      {
        id: 'gateway',
        name: 'lightManage.list.gateway',
        class: 'icon_gateway',
        active: false,
        link: '/light/list/gateway'
      }*/
    ]
  },
  {
    id: 'control',
    name: 'lightManage.control',
    toggled: false,
    active: true,
    link: '/light/control/timeStrategy',
    level: 1,
    children: [
      // {
      //     "id": "scene",
      //     "name": "场景",
      //     "class": "icon_scene",
      //     "active": false,
      //     "link": "/light/control/scene"
      // },{
      //     "id": "strategy",
      //     "name": "策略",
      //     "class": "icon_control",
      //     "active": false,
      //     "link": "/light/control/strategy"
      // }
      {
        id: 'timeStrategy',
        name: 'app.time.strategy',
        class: 'icon_calendar',
        active: false,
        link: '/light/control/timeStrategy'
      },
      {
        id: 'latlngStrategy',
        name: 'app.latlng.strategy',
        class: 'icon_latlng',
        active: false,
        link: '/light/control/latlngStrategy'
      }
    ]
  }
];

export function getModelData(model, cb) {
  return new Promise((resolve, reject)=>{
    getModelConfig(res=>{
      modelConfig = res;
      resolve(res);
    })
  }).then(modelConfig=>{
    return new Promise((resolve, reject)=>{
      getAssetModelList(response=>{
        models = response;
        resolve(response);
      })
    })
  }).then(modelList=>{
    TreeData.map(item => {
      if (item.id === 'list') {
        item.children = [];
        modelConfig.map((key,index)=>{
          const data = lodash.find(models, model=>{return model.name === key});
          if(data){
            const child = { id: data.name, name: data.name+'.name', class: getClassByModel(data.name), active: false, link: getLinkByModel(item.id, data.name) }
            if (index == 0) {
              item.link = getLinkByModel(item.id, data.name);
            }
            item.children.push(child);
          }
        })
      }
    });

    cb && cb();
  })
}

export function getModelList() {
  let list = [];
  for (let key in models) {
    let model = models[key];
    list.push({
      id: model.key,
      title: intlFormat(model.intl.name),
      value: intlFormat(model.intl.name),
    });
  }
  return list;
}

export function getModelById(id) {
  for (let key in models) {
    if (models[key].key == id) {
      return models[key];
    }
  }
  return null;
}

export function getModelNameById(id) {
  let model = getModelById(id);
  if (model) {
    return intlFormat(model.intl.name);
  }

  return null;
}

export function getModelTypesById(id) {
  let model = getModelById(id);
  let list = [];
  if (model) {
    list = model.types.map(type => {
      return {
        id: type,
        title: intlFormat(model.intl.types[type]),
      };
    });
  }

  return list;
}

export function getModelTypesNameById(modelId, typeId) {
  let model = getModelById(modelId);
  return intlFormat(model.intl.types[typeId]);
}

function getLinkByModel(parentId, key) {
  return '/light/list/'+key;
}
