
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import app from '../../App/reducer/index';
import overlayer from '../../overlayer/reducers/overlayer';

import login from '../../login/reducer/index'
import assetManage from '../../assetManage/reducer/index'
import assetStatistics from '../../assetStatistics/reducer/index'
const reducer = combineReducers({
    routing,
    overlayer,

    login,
    app,
    assetManage,
    assetStatistics
});
export default reducer;
