/**
 * Created by a on 2017/8/1.
 */
import { getAssetModelList } from '../api/asset';
import { intlFormat, getClassByModel } from '../util/index';

let models = [];

export const TreeData = [
  {
    'id': 'config',
    'name': 'sysOperation.device.config',
    'toggled': true,
    'active': true,
    'link': '/systemOperation/config',
    'level': 1,
    'children': [
      {
        'id': 'lcc',
        'name': '灯集中控制器',
        'class': 'icon_control',
        'active': true,
      }, {
        'id': 'lc',
        'name': '单灯控制器',
        'class': 'icon_light',
        'active': false,
      },
    ],
  }, {
    'id': 'strategy',
    'name': 'sysOperation.control.strategy',
    'toggled': false,
    'active': true,
    'link': '/systemOperation/strategy/timeTable',
    'level': 1,
    'children': [
      {
        'id': 'timeTable',
        'name': 'app.timetable',
        'class': 'icon_calendar',
        'active': false,
        'link': '/systemOperation/strategy/timeTable',
      }, {
        'id': 'sensor',
        'name': 'app.sensor',
        'class': 'icon_sensor',
        'active': false,
        'link': '/systemOperation/strategy/sensor',
      }, {
        'id': 'latlng',
        'name': 'app.latlng',
        'class': 'icon_latlng',
        'active': false,
        'link': '/systemOperation/strategy/latlng',
      },
    ],

  }, {
    'id': 'serviceMonitor',
    'name': 'sysOperation.service.monitoring',
    'toggled': false,
    'active': true,
    'link': '/systemOperation/serviceMonitor/systemRunningState',
    'level': 1,
    'children':[
      {
        'id': 'systemRunningState',
        'name': '系统运行状态',
        'class': 'icon_status',
        'active': true,
        'link': '/systemOperation/serviceMonitor/systemRunningState',
      },
      {
        'id': 'serviceState',
        'name': '后台服务状态',
        'class': 'icon_sys_status',
        'active': true,
        'link': '/systemOperation/serviceMonitor/serviceState',
      },
    ],
  }, {
    'id': 'systemConfig',
    'name': 'sysOperation.system.config',
    'toggled': false,
    'active': true,
    'link': '/systemOperation/systemConfig/sysConfigSmartLight',
    'level': 1,
    'children': [
      {
        'id': 'sysConfigSmartLight',
        'name': '智慧路灯',
        'class': 'icon_pole',
        'active': true,
        'link': '/systemOperation/systemConfig/sysConfigSmartLight',
      },
      {
        'id': 'sysConfigScene',
        'name': '场景',
        'class': 'icon_scene',
        'active': false,
        'link': '/systemOperation/systemConfig/sysConfigScene',
      },
    ],
  }, {
    'id': 'deviceMonitor',
    'name': 'sysOperation.device.monitoring',
    'toggled': false,
    'active': true,
    'link': '/systemOperation/deviceMonitor/deviceState',
    'level': 1,
    'children': [
      {
        'id': 'deviceState',
        'name': '设备状态图',
        'class': 'icon_status',
        'active': false,
        'link': '/systemOperation/deviceMonitor/deviceState',
      },
      {
        'id': 'deviceTopology',
        'name': '设备拓扑图',
        'class': 'icon_branch',
        'active': false,
        'link': '/systemOperation/deviceMonitor/deviceTopology',
      },
    ],
  }, {
    'id': 'deviceMaintenance',
    'name': 'sysOperation.device.maintenance',
    'toggled': false,
    'active': true,
    'link': '/systemOperation/deviceMaintenance/deviceReplace',
    'level': 1,
    'children': [
      {
        'id': 'deviceReplace',
        'name': '设备更换',
        'class': 'icon_update',
        'active': false,
        'link': '/systemOperation/deviceMaintenance/deviceReplace',
      },
      {
        'id': 'deviceUpdate',
        'name': '设备升级',
        'class': 'icon_upgrade',
        'active': false,
        'link': '/systemOperation/deviceMaintenance/deviceUpdate',
      },
    ],
  },
];


export function getModelData(model, cb) {
  // console.log(model);
  
  // if(models && models.length>0){     cb && cb();     return }
  getAssetModelList(response => {
    // console.log(response);
    models = response;
    TreeData.map(item => {
      if (item.id == 'config') {
        let curModel = getModelById(model);
        if (curModel) {
          // item.link = "/systemOperation/config/" + curModel.key;
        }
        item.children = [];
        response.map((data, index) => {
          let child = {
            id: data.key,
            name: intlFormat(data.intl.name),
            class: getClassByModel(data.key),
            active: data.key == model,
            link: getLinkByModel(data.key),
          };
          if (index == 0) {
            item.link = '/systemOperation/' + item.id + '/' + data.key;
          }
          item.children.push(child);
        });
      }
    });

    cb && cb();
  });
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

function getLinkByModel(key) {
  switch (key) {
  case 'gateway':
    return '/systemOperation/config/gateway';
  case 'lc':
    return '/systemOperation/config/lc';
  case 'sensor':
    return '/systemOperation/config/sensor';
  case 'plc':
    return 'icon_control';
  case 'ammeter':
    return 'icon_ammeter';
  case 'pole':
    return '/systemOperation/config/pole';
  case 'screen':
    return '/systemOperation/config/screen';
  case 'xes':
    return '/systemOperation/config/xes';
  default:
    return 'icon_lc';
  }
}