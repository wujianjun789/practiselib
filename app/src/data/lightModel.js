/**
 * Created by a on 2017/8/24.
 */
export const TreeData=[
    {
        "id": "statistics",
        "name":"app.statistics",
        "toggled": false,
        "active": true,
        "link": "/light/statistics",
        "level":1,
        "children":[
        ]
    },
    {
        "id": "map",
        "name":"app.map",
        "toggled": false,
        "active": true,
        "link": "/light/map",
        "level":1,
        "children":[

        ]
    },
    {
        "id": "list",
        "name": "app.list",
        "toggled": false,
        "active": true,
        "link": "/light/list",
        "level": 1,
        "children": [
            {
                "id": 'lc',
                "name": "sysOperation.lamp.control",
                "class": "icon_lc",
                "active": false,
                "link": "/light/list"
            },
            {
                "id": 'gateway',
                "name": "manage.link.gateway",
                "class": "icon_gateway",
                "active": false,
                "link": "/light/list/gateway"
            }
        ]
    },
    {
        "id": "control",
        "name": "app.control",
        "toggled": false,
        "active": true,
        "link": "/light/control/timeStrategy",
        "level": 1,
        "children": [
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
                "id": "timeStrategy",
                "name": "app.time.strategy",
                "class": "icon_calendar",
                "active": false,
                "link": "/light/control/timeStrategy"
            },
            {
                "id": "latlngStrategy",
                "name": "app.latlng.strategy",
                "class": "icon_latlng",
                "active": false,
                "link": "/light/control/latlngStrategy"
            }
        ]
    }
]