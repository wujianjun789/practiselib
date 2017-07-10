/**
 * Created by a on 2017/7/5.
 */
import {
    ON_CHANGE
} from '../actionType/index'

export function onChange(id, data) {
    return {
        type:ON_CHANGE,
        id: id,
        data: data
    }
}