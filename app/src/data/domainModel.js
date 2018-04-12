/**
 * Created by a on 2017/7/25.
 */
export const TreeData=[
    // {
    //     "id": "domainEdit",
    //     "name":"domain.configuration",
    //     "toggled": false,
    //     "active": true,
    //     "link": "/domainManage/domainEdit/list",
    //     "level":1,
    //     "children": [
    //         {
    //             "id": 'list',
    //             "name":"domain.list",
    //             "class":"icon_domain_list",
    //             "active":false,
    //             "link":"/domainManage/domainEdit/list"
    //         },
    //         {
    //             "id": 'topology',
    //             "name":"domain.topology",
    //             "class":"icon_branch",
    //             "active":false,
    //             "link":"/domainManage/domainEdit/topology"
    //         }
    //     ]
    // },
    {
        "id": 'list',
        "name":"domain.list",
        /*"class":"icon_domain_list",*/
        "toggled": false,
        "active":false,
        "link":"/domainManage/domainEdit/list",
        "level": 1,
        "children":[]
    },
    {
        "id": 'topology',
        "name":"domain.topology",
        /*"class":"icon_branch",*/
        "toggled": false,
        "active":false,
        "link":"/domainManage/domainEdit/topology",
        "level": 1,
        "children":[]
    },
    {
        "id": "mapPreview",
        "name":"domain.map",
        "toggled": false,
        "active": true,
        "link": "/domainManage/mapPreview",
        "level": 1,
        "children":[]
    }
]