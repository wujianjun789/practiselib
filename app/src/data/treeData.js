/**
 * Created by a on 2017/7/3.
 */
export  const TreeData=[
    {
        "id": 1,
        "name":"资产管理",
        "toggled": true,
        "active": true,
        "link": "/assetManage",
        "children": [
            {
                "id": 11,
                "name":"灯集中控制器",
                "class":"icon_light_control",
                "active":true
            },
            {
                "id": 12,
                "name":"LED灯",
                "class":"icon_led_light",
                "active":false
            },{
                "id": 13,
                "name":"PLC回路控制器",
                "class":"icon_plc_control",
                "active":false
            },
            {
                "id": 14,
                "name":"智慧电表",
                "class":"icon_ammeter",
                "active":false
            },
            {
                "id": 15,
                "name":"灯杆",
                "class":"icon_pole",
                "active":false
            },
            {
                "id": 16,
                "name":"广告屏",
                "class":"icon_screen",
                "active":false
            },
            {
                "id": 17,
                "name":"数据采集仪",
                "class":"icon_collect",
                "active":false
            }
        ]
    },
    {
        "id": 2,
        "name":"资产统计",
        "toggled": false,
        "active": true,
        "link": "/assetStatistics"
    }
]