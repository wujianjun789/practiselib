/**
 * Created by a on 2017/4/21.
 */

import Immutable from 'immutable';
const initialState = {
    data: [
        {type:"LC300", detail:"LC300灯控"},
        {type:"LC600", detail:"LC600灯控"},
        {type:"LCMINI", detail:"智慧路灯用"}
    ],
    devicePro:[
        "软件版本",
        "系统版本",
        "内核版本"
    ]
};


export default function assetManage (state=Immutable.fromJS(initialState), action) {
    switch(action.type) {
        default:
            return state;
    }
}