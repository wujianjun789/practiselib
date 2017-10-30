/**
 * Created by a on 2017/7/25.
 */
export const TreeData=[
    {
        "id": "domainEdit",
        "name":"域编辑",
        "toggled": false,
        "active": true,
        "link": "/domainManage/domainEdit/list",
        "level":1,
        "children": [
            {
                "id": 'list',
                "name":"列表模式",
                "class":"icon_domain_list",
                "active":false,
                "link":"/domainManage/domainEdit/list"
            },
            {
                "id": 'topology',
                "name":"拓扑图",
                "class":"icon_branch",
                "active":false,
                "link":"/domainManage/domainEdit/topology"
            }
        ]
    },
    {
        "id": "mapPreview",
        "name":"地图预览",
        "toggled": false,
        "active": true,
        "link": "/domainManage/mapPreview",
        "level": 1,
        "children":[]
    }
]