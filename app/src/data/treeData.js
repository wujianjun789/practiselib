/**
 * Created by a on 2017/7/3.
 */
export  const TreeData=[
    {
        "name":"资产管理",
        "toggled": true,
        "active": true,
        "children": [
            {
                "name":"灯集中控制器",
                "class":"icon_light_control",
                "active":true
            },
            {
                "name":"LED灯",
                "class":"icon_led_light",
                "active":false
            },{
                "name":"PLC回路控制器",
                "class":"icon_plc_control",
                "active":false
            },
            {
                "name":"智慧电表",
                "class":"icon_ammeter",
                "active":false
            },
            {
                "name":"灯杆",
                "class":"icon_pole",
                "active":false
            },
            {
                "name":"广告屏",
                "class":"icon_screen",
                "active":false
            },
            {
                "name":"数据采集仪",
                "class":"icon_collect",
                "active":false
            }
        ]
    },
    {
        "name":"资产统计",
        "toggled": false,
        "active": true,
        "link": "/assetStatistics"
    }
]