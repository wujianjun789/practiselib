const config = {
    'server':{
        'PORT': 8080
    },

    'client':{
        'HOST_IP':"http://"+"localhost"+":3000/api",
        'module':[
            {key: 'asset', title: '资产管理', link: '/assetManage/manage'},
            {key: 'permission', title: '权限管理', link: '/permissionManage'},
            {key: 'maintenance', title: '系统运维', link: '/systemOperation'},
            {key: 'control', title: '系统控制', link: '/'},
            {key: 'report', title: '报表管理', link: '/'},
            {key: 'publish', title: '媒体发布', link: '/'},
            {key: 'visual', title: '可视化', link: '/'},
            {key: 'domain', title: '域管理', link: '/domainManage/domainEdit'}
        ],
        'map':{
            mapOffline: 0,//(0在线1离线2静态图,必须有)
            mapType: "google",//(地图类型,必须有)
            center: [31.239658843127756, 121.49971691534425],
            zoom: 16,//(当前等级)
            minZoom: 10,
            maxZoom: 18,
            maxClusterRadius: 50
        },
        strategyDevice:["lc", "screen"],
        lightLevel:["关",0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    }
}
module.exports = config;