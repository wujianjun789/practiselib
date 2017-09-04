/**
 * Created by a on 2017/8/1.
 */
import {getAssetModelList} from '../api/asset'
import {intlFormat, getClassByModel} from '../util/index'

let models = []

export const TreeData = [
  {
    "id": "config",
    "name": "设备配置",
    "toggled": true,
    "active": true,
    "link": "/systemOperation/config",
    "level": 1,
    "children": [
      {
        "id": 'lcc',
        "name": "灯集中控制器",
        "class": "icon_light_control",
        "active": true
      }, {
        "id": 'lc',
        "name": "单灯控制器",
        "class": "icon_single_lamp_control",
        "active": false
      }
    ]
  }, {
    "id": "strategy",
    "name": "控制策略",
    "toggled": false,
    "active": true,
    "link": "/systemOperation/strategy/timeTable",
    "level": 1,
    "children": [
      {
        "id": 'timeTable',
        "name": "时间表",
        "class": "icon_time_strategy",
        "active": false,
        "link": "/systemOperation/strategy/timeTable"
      }, {
        "id": 'sensor',
        "name": "传感器",
        "class": "icon_sensor_strategy",
        "active": false,
        "link": "/systemOperation/strategy/sensor"
      }, {
        "id": 'latlng',
        "name": "经纬度",
        "class": "icon_latlng_strategy",
        "active": false,
        "link": "/systemOperation/strategy/latlng"
      }
    ]

  }, {
    "id": "serviceMonitor",
    "name": "服务监控",
    "toggled": false,
    "active": true,
    "link": "/systemOperation",
    "level": 1
  }
]

export const modelData = [
  {
    "key": "lc",
    "name": "lc",
    "props": [
      "power",
      "software",
      "system",
      "hardware",
      "fault",
      "manufacturer",
      "manufactureDate",
      "min",
      "max",
      "gradient",
      "dimmingMode",
      "comm"
    ],
    "types": [
      "LAMP_SANSI", "LAMP_HWNB"
    ],
    "intl": {
      "name": {
        "en": "single light controller",
        "zh": "单灯控制器"
      },
      "props": {
        "power": {
          "en": "power",
          "zh": "电源类型"
        },
        "software": {
          "en": "software",
          "zh": "软件版本"
        },
        "system": {
          "en": "software",
          "zh": "软件版本"
        },
        "hardware": {
          "en": "hardware",
          "zh": "硬件版本"
        },
        "manufacturer": {
          "en": "manufacturer",
          "zh": "厂商信息"
        },
        "manufactureDate": {
          "en": "date of manufacture",
          "zh": "出厂日期"
        },
        "fault": {
          "en": "default fault level",
          "zh": "默认故障亮度"
        },
        "min": {
          "en": "min level",
          "zh": "最小亮度"
        },
        "max": {
          "en": "max level",
          "zh": "最大亮度"
        },
        "gradient": {
          "en": "gradient time",
          "zh": "调光渐变时间"
        },
        "dimmingMode": {
          "en": "调光模式",
          "zh": "调光模式"
        },
        "comm": {
          "en": "通信模式",
          "zh": "通信模式"
        }
      },
      "types": {
        "LAMP_SANSI": {
          "en": "三思LC",
          "zh": "三思LC"
        },
        "LAMP_HWNB": {
          "en": "华为NB_IoT",
          "zh": "华为NB_IoT"
        }
      }
    },
    "defaults": {
      "props": [
        "power", "dimmingMode", "comm"
      ],
      "values": {
        "LAMP_SANSI": {
          "power": "ONE_WAY",
          "dimmingMode": "SCT",
          "comm": "ZigBee"
        },
        "LAMP_HWNB": {
          "power": "ONE_WAY",
          "dimmingMode": "SCT",
          "comm": "NB_IoT"
        }
      }
    }
  }, {
    "key": "lcc",
    "name": "lcc",
    "props": [
      "software",
      "system",
      "kernel",
      "hardware",
      "manufacturer",
      "comm"
    ],
    "types": [
      "LC300", "LC600", "LCMini"
    ],
    "intl": {
      "name": {
        "en": "light controller container",
        "zh": "灯集中控制器"
      },
      "props": {
        "software": {
          "en": "software",
          "zh": "软件版本"
        },
        "system": {
          "en": "system",
          "zh": "系统版本"
        },
        "kernel": {
          "en": "kernel",
          "zh": "内核版本"
        },
        "hardware": {
          "en": "hardware",
          "zh": "硬件版本"
        },
        "manufacturer": {
          "en": "manufacturer",
          "zh": "厂商信息"
        },
        "comm": {
          "en": "control type : 485 | PLC | Wireless",
          "zh": "控制方式 : 485 | PLC | Wireless"
        }
      },
      "types": {
        "LC300": {
          "en": "LC300 Light Controller",
          "zh": "LC300 灯控"
        },
        "LC600": {
          "en": "LC600 Light Controller",
          "zh": "LC600 灯控"
        },
        "LCMini": {
          "en": "LCMini Light Controller",
          "zh": "LCMini 灯控"
        }
      }
    },
    "defaults": {
      "props": ["comm"],
      "values": {
        "LC300": {
          "comm": "Wireless"
        },
        "LC600": {
          "comm": "Wireless"
        },
        "LCMini": {
          "comm": "Wireless"
        }
      }
    }
  }, {
    "key": "sensor",
    "name": "sensor",
    "props": [
      "manufacturer", "unit", "accuracy", "max", "min"
    ],
    "types": [
      "SENSOR_NOISE",
      "SENSOR_PM25",
      "SENSOR_PA",
      "SENSOR_HUMIS",
      "SENSOR_TEMPS",
      "SENSOR_WINDS",
      "SENSOR_WINDDIR",
      "SENSOR_CO",
      "SENSOR_O2",
      "SENSOR_CH4",
      "SENSOR_CH2O"
    ],
    "intl": {
      "name": {
        "en": "sensor",
        "zh": "传感器"
      },
      "props": {
        "manufacturer": {
          "en": "power",
          "zh": "厂商"
        },
        "unit": {
          "en": "unit",
          "zh": "单位"
        },
        "accuracy": {
          "en": "accuracy",
          "zh": "精度"
        },
        "max": {
          "en": "max",
          "zh": "最大值"
        },
        "min": {
          "en": "min",
          "zh": "最小值"
        }
      },
      "types": {
        "SENSOR_NOISE": {
          "en": "噪声传感器",
          "zh": "噪声传感器"
        },
        "SENSOR_PM25": {
          "en": "PM2.5传感器",
          "zh": "PM2.5传感器"
        },
        "SENSOR_PA": {
          "en": "大气压",
          "zh": "大气压"
        },
        "SENSOR_HUMIS": {
          "en": "湿度传感器",
          "zh": "噪声传感器"
        },
        "SENSOR_TEMPS": {
          "en": "温度传感器",
          "zh": "温度传感器"
        },
        "SENSOR_WINDS": {
          "en": "风速传感器",
          "zh": "风速传感器"
        },
        "SENSOR_WINDDIR": {
          "en": "风向传感器",
          "zh": "风向传感器"
        },
        "SENSOR_CO": {
          "en": "一氧化碳传感器",
          "zh": "一氧化碳传感器"
        },
        "SENSOR_O2": {
          "en": "氧气传感器",
          "zh": "氧气传感器"
        },
        "SENSOR_CH4": {
          "en": "甲烷",
          "zh": "甲烷"
        },
        "SENSOR_CH2O": {
          "en": "甲醛",
          "zh": "甲醛"
        }
      }
    },
    "defaults": {
      "props": [
        "unit", "accuracy", "max", "min"
      ],
      "values": {
        "SENSOR_NOISE": {
          "unit": "dB",
          "accuracy": "0.1",
          "max": "",
          "min": "0"
        },
        "SENSOR_PM25": {
          "unit": "ug/m3",
          "accuracy": "1",
          "max": "",
          "min": "0"
        },
        "SENSOR_PA": {
          "unit": "hPa",
          "accuracy": "1",
          "max": "",
          "min": "0"
        },
        "SENSOR_HUMIS": {
          "unit": "rh%",
          "accuracy": "0.1",
          "max": "",
          "min": "0"
        },
        "SENSOR_TEMPS": {
          "unit": "℃",
          "accuracy": "0.1",
          "max": "",
          "min": "-60"
        },
        "SENSOR_WINDS": {
          "unit": "m/s",
          "accuracy": "1",
          "max": "",
          "min": "0"
        },
        "SENSOR_WINDDIR": {
          "unit": "°",
          "accuracy": "0.1",
          "max": "360",
          "min": "0"
        },
        "SENSOR_CO": {
          "unit": "ppm",
          "accuracy": "1",
          "max": "",
          "min": "0"
        },
        "SENSOR_O2": {
          "unit": "%VOL",
          "accuracy": "0.01",
          "max": "",
          "min": "0"
        },
        "SENSOR_CH4": {
          "unit": "",
          "accuracy": "",
          "max": "",
          "min": ""
        },
        "SENSOR_CH2O": {
          "unit": "",
          "accuracy": "",
          "max": "",
          "min": ""
        }
      }
    }
  }, {
    "key": "screen",
    "name": "screen",
    "props": [
      "power",
      "software",
      "system",
      "hardware",
      "fault",
      "manufacturer",
      "manufactureDate",
      "min"
    ],
    "types": [],
    "intl": {
      "name": {
        "en": "display screen",
        "zh": "显示屏"
      },
      "props": {
        "power": {
          "en": "power",
          "zh": "型号"
        },
        "software": {
          "en": "software",
          "zh": "分辨率宽度"
        },
        "system": {
          "en": "software",
          "zh": "分辨率高度"
        },
        "hardware": {
          "en": "hardware",
          "zh": "基色数"
        },
        "manufacturer": {
          "en": "manufacturer",
          "zh": "点间距"
        },
        "manufactureDate": {
          "en": "date of manufacture",
          "zh": "存储器大小"
        },
        "fault": {
          "en": "default fault level",
          "zh": "软件版本"
        },
        "min": {
          "en": "min level",
          "zh": "硬件版本"
        }
      },
      "types": {}
    },
    "defaults": {
      "props": [],
      "values": {}
    }
  }, {
    "key": "smartlight",
    "name": "smartlight",
    "props": [],
    "types": [],
    "intl": {
      "name": {
        "en": "smartlight",
        "zh": "智慧路灯"
      },
      "props": {},
      "types": {}
    },
    "defaults": {
      "props": [],
      "values": {}
    }
  }, {
    "key": "smartlightPole",
    "name": "smartlightPole",
    "props": [],
    "types": [],
    "intl": {
      "name": {
        "en": "smartlightPole",
        "zh": "灯杆"
      },
      "props": {},
      "types": {}
    },
    "defaults": {
      "props": [],
      "values": {}
    }
  }, {
    "key": "collect",
    "name": "dataCollect",
    "props": [],
    "types": [],
    "intl": {
      "name": {
        "en": "Data Collect",
        "zh": "数据采集仪"
      },
      "props": {},
      "types": {}
    },
    "defaults": {
      "props": [],
      "values": {}
    }
  }
]

export function getModelData(model, cb) {
  // if(models && models.length>0){     cb && cb();     return }
  getAssetModelList(response => {
    models = response;
    TreeData.map(item => {
      if (item.id == "config") {
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
            active: data.key == model ? true : false,
            link: getLinkByModel(data.key)
          };
          if(index==0){
            item.link = "/systemOperation/"+item.id+"/"+data.key;
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
  for (let key in models) {
    let model = models[key]
    list.push({
      id: model.key,
      title: intlFormat(model.intl.name),
      value: intlFormat(model.intl.name)
    })
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
    list = model
      .types
      .map(type => {
        return {
          id: type,
          title: intlFormat(model.intl.types[type])
        }
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
    case 'lcc':
      return '/systemOperation/config/lcc';
    case 'lc':
      return '/systemOperation/config/lc';
    case 'sensor':
      return '/systemOperation/config/sensor';
    case 'smartlight':
      return '/systemOperation/config/smartlight';
    case 'smartlightPole':
      return '/systemOperation/config/smartlightPole';
    case 'plc':
      return 'icon_plc_control';
    case 'ammeter':
      return 'icon_ammeter';
    case 'pole':
      return 'icon_pole';
    case 'screen':
      return '/systemOperation/config/screen';
    case 'collect':
      return '/systemOperation/config/collect';
    default:
      return 'icon_led_light';
  }
}