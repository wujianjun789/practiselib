/**
 * Created by a on 2017/4/21.
 */

import Immutable from 'immutable';
const initialState = {
};


export default function login (state=Immutable.fromJS(initialState), action) {
    switch(action.type) {
        default:
            return state;
    }
}