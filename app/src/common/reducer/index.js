
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { intlReducer as intl } from 'react-intl-redux';

import app from '../../app/reducer/index';
import overlayer from './overlayer';

// import login from '../../login/reducer/index'
import assetManage from '../../assetManage/reducer/index'
import assetStatistics from '../../assetStatistics/reducer/index'
import domainManage from '../../domainManage/reducer/index'
import treeView from './treeView';
import permissionManage from '../../permissionManage/reducer/index'
import sysOperation from '../../systemOperation/reducer/index';
import gateway from '../../systemOperation/reducer/gateway';

import notifyPopup from './notifyPopup';
import auth from '../../authentication/reducer';
const reducer = combineReducers({
    routing,
    intl,
    auth,
    overlayer,
    treeView,
    notifyPopup,
    // login,
    app,
    assetManage,
    assetStatistics,

    domainManage,
    permissionManage,

    sysOperation,
    gateway
});
export default reducer;
