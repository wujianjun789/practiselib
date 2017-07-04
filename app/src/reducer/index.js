
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import test from './test';
import course from './course';

import login from '../login/reducer/index'
import assetManage from '../assetManage/reducer/index'
const reducer = combineReducers({
    routing,
    course,
    test,

    login,
    assetManage
});
export default reducer;
