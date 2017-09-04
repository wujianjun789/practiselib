
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import app from '../../app/reducer/index';
import overlayer from './overlayer';

// import login from '../../login/reducer/index'
import assetManage from '../../assetManage/reducer/index'
import assetStatistics from '../../assetStatistics/reducer/index'
import domainManage from '../../domainManage/reducer/index'
import treeView from './treeView';
import userCenter from './userCenter';
import permissionManage from '../../permissionManage/reducer/index'
import sysOperation from '../../systemOperation/reducer/index';
import lampConCenter from '../../systemOperation/reducer/lampConCenter';

import notifyPopup from './notifyPopup';
import auth from '../../authentication/reducer';
const reducer = combineReducers({
    routing,
    auth,
    overlayer,
    userCenter,
    treeView,
    notifyPopup,
    // login,
    app,
    assetManage,
    assetStatistics,

    domainManage,
    permissionManage,

    sysOperation,
    lampConCenter
});
export default reducer;
