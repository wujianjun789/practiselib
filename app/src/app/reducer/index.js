/**
 * create by Azrael on 2017/7/4
 */

import {
    MODULE_INIT
} from '../actionType/index';

export const moduleInfo = {
	asset: {key: 'asset', title: '资产管理', link: '/assetManage/model'},
	permission: {key: 'permission', title: '权限管理', link: '/permissionManage'},
	maintenance: {key: 'maintenance', title: '系统运维', link: '/systemOperation/config'},
	control: {key: 'control', title: '智慧路灯', link: '/smartLight/map'},
	light: {key: 'light', title: '智能照明', link: '/light/map'},
	report: {key: 'report', title: '报表管理', link: '/reporterManage/device'},
	publish: {key: 'publish', title: '媒体发布', link: '/mediaPublish/playerList'},
	visual: {key: 'visual', title: '可视化', link: '/'},
	domain: {key: 'domain', title: '域管理', link: '/domainManage/domainEdit/list'}
};

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

export function moduleInit(state, data) {
    let items = data.map(val => {
		if(moduleInfo[val.key]) {
			return moduleInfo[val.key];
		} else {
			return {key: '', title: '', link: '/'};
		}
    });
    return Object.assign({...state, items: items});
}
