/**
 * create by Azrael on 2017/7/4
 */
export const initialState = {
    title: "StarRiver",
    name: "智慧路灯管理系统",
    items: [
        {key: 'asset', title: '资产管理', link: '/assetManage/manage'},
        {key: 'permission', title: '权限管理', link: '/permissionManage'},
        {key: 'maintenance', title: '系统运维', link: '/'},
        {key: 'control', title: '系统控制', link: '/'},
        {key: 'report', title: '报表管理', link: '/'},
        {key: 'publish', title: '媒体发布', link: '/'},
        {key: 'visual', title: '可视化', link: '/'},
        {key: 'domain', title: '域管理', link: '/domainManage'},
    ],
};

export default function app(state=initialState, action) {
    switch(action.type) {
        default:
            return state;
    }
}