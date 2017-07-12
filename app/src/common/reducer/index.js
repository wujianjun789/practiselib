
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import app from '../../App/reducer/index';
import overlayer from '../../overlayer/reducers/overlayer';

import login from '../../login/reducer/index'
import assetManage from '../../assetManage/reducer/index'
import assetStatistics from '../../assetStatistics/reducer/index'
import userCenter from '../../userCenter/reducers'
const reducer = combineReducers({
    routing,
    overlayer,

    userCenter,
    login,
    app,
    assetManage,
    assetStatistics
});
export default reducer;
