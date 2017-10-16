/**
 * Created by Azrael on 2017/10/16
 */
export const TreeData=[
    {
        "id": "device",
        "name":"设备",
        "toggled": true,
        "active": true,
        "link": "/reporterManage/device",
		"level":1,
		"children": [
			{
                "id": 'brightness',
                "name": "亮度",
                "class": "icon_led_light",
                "active": true,
                "link": "/reporterManage/device"
            },
			{
                "id": 'amp',
                "name": "电流",
                "class": "icon_led_light",
                "active": false,
                "link": "/reporterManage/device/amp"
            },
			{
                "id": 'voltage',
                "name": "电压",
                "class": "icon_led_light",
                "active": false,
                "link": "/reporterManage/device/voltage"
            },
			{
                "id": 'power',
                "name": "功率",
                "class": "icon_led_light",
                "active": false,
                "link": "/reporterManage/device/power"
            },
			{
                "id": 'sensor',
                "name": "传感器",
                "class": "icon_led_light",
                "active": false,
                "link": "/reporterManage/device/sensor"
            },
		]
	},
	{
		"id": "log",
        "name":"日志查询",
        "toggled": false,
        "active": true,
        "link": "/reporterManage/device",
		"level":1,
		"children": []
	},
	{
		"id": "fault",
        "name":"故障管理",
        "toggled": false,
        "active": true,
        "link": "/reporterManage/device",
		"level":1,
		"children": []
	}
]
