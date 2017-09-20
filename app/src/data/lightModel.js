/**
 * Created by a on 2017/8/24.
 */
export const TreeData=[
    {
        "id": "map",
        "name":"地图",
        "toggled": false,
        "active": true,
        "link": "/light/map",
        "level":1
    },
    {
        "id": "list",
        "name": "列表",
        "toggled": false,
        "active": true,
        "link": "/light/list",
        "level": 1,
        "children": [
            {
                "id": 'lc',
                "name": "单灯控制器",
                "class": "icon_led_light",
                "active": false,
                "link": "/light/list"
            },
            {
                "id": 'gateway',
                "name": "网关",
                "class": "icon_light_control",
                "active": false,
                "link": "/light/list/gateway"
            }
        ]
    },
    {
        "id": "control",
        "name": "控制",
        "toggled": false,
        "active": true,
        "link": "/light/control/scene",
        "level": 1,
        "children": [
            {
                "id": "scene",
                "name": "场景",
                "class": "icon_scene",
                "active": false,
                "link": "/light/control/scene"
            },{
                "id": "strategy",
                "name": "策略",
                "class": "icon_plc_control",
                "active": false,
                "link": "/light/control/strategy"
            }
        ]
    }
]