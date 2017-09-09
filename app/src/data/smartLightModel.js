/**
 * Created by a on 2017/8/24.
 */
export const TreeData = [
    {
        "id": "map",
        "name": "地图",
        "toggled": false,
        "active": true,
        "link": "/smartLight/map",
        "level": 1
    },
    {
        "id": "list",
        "name": "列表",
        "toggled": false,
        "active": true,
        "link": "/smartLight/list",
        "level": 1,
        "children": [
            {
                "id": 'lc',
                "name": "单灯控制器",
                "class": "icon_led_light",
                "active": false,
                "link": "/smartLight/list"
            },
            {
                "id": 'lcc',
                "name": "灯集中控制器",
                "class": "icon_light_control",
                "active": false,
                "link": "/smartLight/list/lcc"
            },
            {
                "id": 'screen',
                "name": "显示屏",
                "class": "icon_screen",
                "active": false,
                "link": "/smartLight/list/screen"
            },
            {
                "id": 'xes',
                "name": "数据采集仪",
                "class": "icon_collect",
                "active": false,
                "link": "/smartLight/list/xes"
            },
            {
                "id": 'chargePole',
                "name": "充电桩",
                "class": "icon_charge_pole",
                "active": false,
                "link": "/smartLight/list/chargePole"
            },
            {
                "id": 'sensor',
                "name": "传感器",
                "class": "icon_sensor_strategy",
                "active": false,
                "link": "/smartLight/list/sensor"
            }
        ]
    },
    {
        "id": "control",
        "name": "控制",
        "toggled": false,
        "active": true,
        "link": "/smartLight/control/scene",
        "level": 1,
        "children": [
            {
                "id": "scene",
                "name": "场景",
                "active": false,
                "link": "/smartLight/control/scene"
            },{
                "id": "strategy",
                "name": "策略",
                "active": false,
                "link": "/smartLight/control/strategy"
            }
        ]
    }
]