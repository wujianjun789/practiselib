import Immutable from 'immutable';
import { TEST_INC } from '../actionTypes';
const initialState = {
    value: 0,
    list: [
        { id: 1, text: 'text1' },
        { id: 2, text: 'text2' },
        { id: 3, text: 'text3' }
    ]
}
export default function (state = Immutable.fromJS(initialState), action) {
    switch (action.type) {
        case TEST_INC:
            return state.update('value', v => v + 1);
        default: return state;
    }
}