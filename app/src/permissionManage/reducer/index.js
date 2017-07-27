import Immutable from 'immutable';

const initialState = {
    datas:{

    },
    popupinfo:{

    },
};


export default function permissionManage (state=Immutable.fromJS(initialState), action) {
    switch(action.type) {
        default:
            return state;
    }
}