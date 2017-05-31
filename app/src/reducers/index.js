
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import test from './test';
import course from './course';
const reducer = combineReducers({
    routing,
    course,
    test
});
export default reducer;
