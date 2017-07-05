/**
 * Created by a on 2017/4/21.
 */

import Immutable from 'immutable';
const initialState = {
    data: [

    ]
};


export default function assetManage (state=Immutable.fromJS(initialState), action) {
    switch(action.type) {
        default:
            return state;
    }
}