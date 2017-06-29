
import { ACTIVE_CHANGE, SEARCH } from '../actionTypes';
const initialState = {
    active: 0,
    results: [
        { avatar: "/images/1.jpg", name: "LiuXia@sansi.com" },
        { avatar: "", name: "Hello World" },
    ]
}
export default function (state = initialState, action) {
    switch (action.type) {
        case ACTIVE_CHANGE:
            return active(state, action.index);
        case SEARCH:
            return search(state, action.value);
        default: return state;
    }
}

export function active(state, index) {
    return Object.assign({}, state, { active: index })
}

export function search(state, value) {
    return Object.assign({}, state, { search: value, active: 0 })
}