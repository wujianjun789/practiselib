/**
 * Created by a on 2017/8/1.
 */
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
                "class":"icon_light_control",
                "active":true
            },
            {
                "id": 'singleLampCon',
                "name":"单灯控制器",
                "class":"icon_single_lamp_control",
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