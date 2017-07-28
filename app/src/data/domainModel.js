/**
 * Created by a on 2017/7/25.
 */

export const TreeData=[
    {
        "id": "domainEdit",
        "name":"域编辑",
        "toggled": true,
        "active": true,
        "link": "/domainManage/domainEdit",
        "level":1,
        "children": [
            {
                "id": 'list-mode',
                "name":"列表模式",
                "class":"icon_domain_list",
                "active":true
            },
            {
                "id": 'topology-mode',
                "name":"拓扑图",
                "class":"icon_domain_topology",
                "active":false
            }
        ]
    },
    {
        "id": "mapPreview",
        "name":"地图预览",
        "toggled": false,
        "active": true,
        "link": "/domainManage/mapPreview",
        "level": 1
    }
]