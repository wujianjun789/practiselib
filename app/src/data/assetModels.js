/**
 * Created by a on 2017/7/3.
 */
import { getAssetModelList } from '../api/asset';
import { intlFormat, getClassByModel, transformKey } from '../util/index';

let models = [

];

export const TreeData = [
  {
    'id': 'model',
    'name': 'asset.model',
    'toggled': false,
    'active': true,
    'link': '/assetManage/model',
    'level': 1,
    'children': [
      {
        'id': 11,
        'name': '灯集中控制器',
        'class': 'icon_gateway',
        'active': true,
      },
      {
        'id': 12,
        'name': 'LED灯',
        'class': 'icon_lc',
        'active': false,
      }, {
        'id': 13,
        'name': 'PLC回路控制器',
        'class': 'icon_control',
        'active': false,
      },
      {
        'id': 14,
        'name': '智慧电表',
        'class': 'icon_ammeter',
        'active': false,
      },
      {
        'id': 15,
        'name': '灯杆',
        'class': 'icon_pole',
        'active': false,
      },
      {
        'id': 16,
        'name': '广告屏',
        'class': 'icon_screen',
        'active': false,
      },
      {
        'id': 17,
        'name': '数据采集仪',
        'class': 'icon_collect',
        'active': false,
      },
    ],
  },
  {
    'id': 'statistics',
    'name': 'asset.statistics',
    'toggled': false,
    'active': true,
    'link': '/assetManage/statistics',
    'level': 1,
    'children': [
      {
        'id': 11,
        'name': '灯集中控制器',
        'class': 'icon_gateway',
        'active': true,
      },
      {
        'id': 12,
        'name': 'LED灯',
        'class': 'icon_lc',
        'active': false,
      },

    ],
  },
];

export let first_child = {};
export function getModelData(cb) {
  // if(models && models.length>0){
  //     cb && cb();
  //     return
  // }

  getAssetModelList(response => {
    models = response;
    TreeData.map(item => {
      if (item.children) {
        item.children = [];
        response.map((data, index) => {
          // let child = {id:data.key, name:intlFormat(data.intl.name), class:getClassByModel(data.key), active:false, link:getLinkByModel(item.id, data.key)};
          const child = { id: transformKey(data.name), name: data.description, class: getClassByModel(data.name), active: false, link: getLinkByModel(item.id, data.name) }
          if (index == 0) {
            item.link = getLinkByModel(item.id, data.name);
          }
          item.children.push(child);
        });
      }
    });

    cb && cb();
  });
}



function getLinkByModel(parentId, key) {
  switch (key) {
      case 'gateway':
      case 'ssgw':
        return '/assetManage/' + parentId + '/gateway';
      case 'lc':
      case 'ssslc':
        return '/assetManage/' + parentId + '/lc';
      case 'sensor':
      case 'sses':
        return '/assetManage/' + parentId + '/sensor';
      case 'ammeter':
        return 'icon_ammeter';
      case 'pole':
        return '/assetManage/' + parentId + '/pole';
      case 'screen':
      case 'ssads':
        return '/assetManage/' + parentId + '/screen';
      case 'xes':
        return '/assetManage/' + parentId + '/xes';
      case 'smartlight':
        return '/assetManage/' + parentId + '/smartlight';
      default:
        return 'icon_led_light';
  }
}

export function getModelList() {
  let list = [];
  for (let key in models) {
    let model = models[key];
    list.push({ id: model.id, name:/*intlFormat(model.intl.name)*/model.description });
  }

  return list;
}

export function getModelById(id) {
  for (let key in models) {
    if (models[key].name == id) {
      return models[key];
    }
  }

  return null;
}

export function getModelNameById(id) {
  let model = getModelById(id);
  if (model) {
    return /*intlFormat(model.intl.name)*/model.description;
  }

  return '';
}

export function getModelProps(id) {
  let model = getModelById(id);
  return model.specific;
  // let list = [];
  // for (var i = 0; i < model.props.length; i++) {
  //   let prop = model.props[i];
  //   list.push(intlFormat(model.intl.props[prop]));
  // }
  //
  // return list;
}

export function getModelTypes(id) {
  let model = getModelById(id);
  return model.specific;
  // let list = [];
  // for (var i = 0; i < model.types.length; i++) {
  //   let type = model.types[i];
  //   list.push({type:type, detail:intlFormat(model.intl.types[type])});
  // }
  // return list;
}

export function getModelDefaults(id) {
  let model = getModelById(id);
  let list = [];
  // list.push({field:"type", title:"型号"});
  list.push({ field: 'type', title: intlFormat({ en: 'type', zh: '产品类别' }) });
  for (var i in model.defaults.props) {
    let props = model.defaults.props[i];
    list.push({ field: props, title: intlFormat(model.intl.props[props]) });
  }
  return list;
}

export function getModelDefaultsValues(id) {
  let model = getModelById(id);
  let list = [];
  for (var key in model.defaults.values) {
    list.push(Object.assign({}, { type: key }, model.defaults.values[key]));
  }
  return list;
}

/**获取传感器默认值**/
export function getSensorDefaultValues() {
  let model = getModelById('sensor');
  let sensor = {};
  for (var key in model.defaults.values) {
    sensor[key] = model.defaults.values[key];
  }

  return sensor;
}

/**删除设备型号 */
export function deleteModalTypes() {

}

/**添加设备型号 */
export function addModalTypes() {

}