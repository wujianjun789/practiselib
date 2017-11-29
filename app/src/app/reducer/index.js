/**
 * create by Azrael on 2017/7/4
 */

import {
    MODULE_INIT
} from '../actionType/index';

export const moduleInfo = {
	asset: {key: 'asset', title: 'app.asset.manage', link: '/assetManage/model'},
	permission: {key: 'permission', title: 'app.permission.manage', link: '/permissionManage'},
	maintenance: {key: 'maintenance', title: 'app.system.operation', link: '/systemOperation/config'},
	control: {key: 'control', title: 'app.smart.light', link: '/smartLight/map'},
	light: {key: 'light', title: 'app.light', link: '/light/map'},
	report: {key: 'report', title: 'app.report.manage', link: '/reporterManage/device'},
	publish: {key: 'publish', title: 'app.mediaPublish', link: '/mediaPublish/playerList'},
	visual: {key: 'visual', title: 'app.visualization', link: '/'},
	domain: {key: 'domain', title: 'app.domain.manage', link: '/domainManage/domainEdit/list'}
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
	console.log(data);
    let items = data.map(val => {
		if(moduleInfo[val.key]) {
			return moduleInfo[val.key];
		} else {
			return {key: '', title: '', link: '/'};
		}
    });
    return Object.assign({...state, items: items});
}
