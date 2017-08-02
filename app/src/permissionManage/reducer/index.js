import Immutable from 'immutable';
const initialState = {
    datas:[
        {
            id:1,grade:'administrator' ,userName :'admin001',loginTime:'2017/7/14 15:03'
        },
        {
            id:2,grade:'operator' ,userName :'admin002',loginTime:'2017/7/14 14:02'
        },
    ]
};


export default function permissionManage (state=initialState, action) {
    switch(action.type) {
        default:
            return state;
    }
}