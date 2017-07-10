
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import test from './test';
import course from './course';
import app from '../App/reducer/index';
import overlayer from '../overlayer/reducers/overlayer';

import login from '../login/reducer/index'
import assetManage from '../assetManage/reducer/index'
import assetStatistics from '../assetStatistics/reducer/index'
const reducer = combineReducers({
    routing,
    overlayer,
    
    course,
    test,

    login,
    app,
    assetManage,
    assetStatistics
});
export default reducer;
