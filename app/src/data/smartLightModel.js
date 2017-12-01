/**
 * Created by a on 2017/8/24.
 */
export const TreeData = [
    {
        "id": "map",
        "name": "app.map",
        "toggled": false,
        "active": true,
        "link": "/smartLight/map",
        "level": 1,
        "children":[]
    },
    {
        "id": "list",
        "name": "app.list",
        "toggled": false,
        "active": true,
        "link": "/smartLight/list",
        "level": 1,
        "children": [
            {
                "id": 'lc',
                "name": "单灯控制器",
                "class": "icon_lc",
                "active": false,
                "link": "/smartLight/list"
            },
            {
                "id": 'gateway',
                "name": "网关",
                "class": "icon_control",
                "active": false,
                "link": "/smartLight/list/gateway"
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
                "class": "icon_sensor",
                "active": false,
                "link": "/smartLight/list/sensor"
            }
        ]
    },
    {
        "id": "control",
        "name": "app.control",
        "toggled": false,
        "active": true,
        "link": "/smartLight/control/scene",
        "level": 1,
        "children": [
            {
                "id": "scene",
                "name": "app.scene",
                "class": "icon_scene",
                "active": false,
                "link": "/smartLight/control/scene"
            },{
                "id": "strategy",
                "name": "app.strategy",
                "class": "icon_control",
                "active": false,
                "link": "/smartLight/control/strategy"
            }
        ]
    }
]