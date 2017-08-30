/**
 * create by Azrael on 2017/7/4
 */

import {
    MODULE_INIT
} from '../actionType/index';

export const initialState = {
    title: "StarRiver",
    name: "智慧路灯管理系统",
    items: [],
};

export default function app(state=initialState, action) {
    switch(action.type) {
        case MODULE_INIT:
            return moduleInit(state, action.data);
        default:
            return state;
    }
}

function moduleInit(state, data) {
    let items = data.map(val => {
        let item = {};
        switch(val.key) {
            case 'asset':
                item.key = 'asset';
                item.title = '资产管理';
                item.link = '/assetManage/model';
                break;
            case 'permission':
                item.key = 'permission';
                item.title = '权限管理';
                item.link = '/permissionManage';
                break;
            case 'maintenance':
                item.key = 'maintenance';
                item.title = '系统运维';
                item.link = '/systemOperation/config/lc';
                break;
            case 'control':
                item.key = 'control';
                item.title = '智慧路灯';
                item.link = '/smartLight';
                break;
            case 'report':
                item.key = 'report';
                item.title = '报表管理';
                item.link = '/';
                break;
            case 'publish':
                item.key = 'publish';
                item.title = '媒体发布';
                item.link = '/';
                break;
            case 'visual':
                item.key = 'visual';
                item.title = '可视化';
                item.link = '/';
                break;
            case 'domain':
                item.key = 'domain';
                item.title = '域管理';
                item.link = '/domainManage/domainEdit';
                break;
        }
        return item;
    });
    return Object.assign({}, state, {items: items});
}