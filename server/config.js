const config = {
    'server':{
        'PORT': 8080
    },

    'client':{
        'HOST_IP':"http://"+"localhost"+":3000/api",
        'module':[
            {key: 'asset', title: '资产管理', link: '/assetManage/manage'},
            {key: 'permission', title: '权限管理', link: '/permissionManage'},
            {key: 'maintenance', title: '系统运维', link: '/systemOperation/lampConCenter'},
            {key: 'control', title: '系统控制', link: '/'},
            {key: 'report', title: '报表管理', link: '/'},
            {key: 'publish', title: '媒体发布', link: '/'},
            {key: 'visual', title: '可视化', link: '/'},
            {key: 'domain', title: '域管理', link: '/domainManage/domainEdit'}
        ],
        'map':{
            'center': [31.239658843127756, 121.49971691534425]
        }
    }
}
module.exports = config;