import { TEST_INC } from '../actionTypes';
import { ACTIVE_CHANGE, SEARCH } from '../actionTypes';
export function test_inc() {
    return { type: TEST_INC }
}

export function active(index) {
    return { type: ACTIVE_CHANGE, index }
}

export function search(value) {
    return { type: SEARCH, value }
}