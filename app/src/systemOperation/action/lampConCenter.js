import {
    SYSTEM_OPERATION_DOMAIN_SELECT_CHANGE,
    SYSTEM_OPERATION_PAGE_CHANGE
} from '../actionType/lampConCenter';

export function domainSelectChange(value) {
    return {
        type: SYSTEM_OPERATION_DOMAIN_SELECT_CHANGE,
        value
    }
}

export function searchSubmit(value) {
    console.log(value);
}

export function pageChange(current, pageSize) {
    return{
        type: SYSTEM_OPERATION_PAGE_CHANGE,
        current,
        pageSize
    }
}