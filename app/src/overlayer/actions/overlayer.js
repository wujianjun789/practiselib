/**
 *  created by Azrael on 2017/02/23
 */
import {
    OVERLAYER_HIDDEN,
    OVERLAYER_SHOW
} from '../actionTypes/overlayer.js'

/**
 * hide overlayer
 */
export function overlayerHide() {
    return {
        type: OVERLAYER_HIDDEN
    }
}

/**
 * show overlayer
 * @param page {node} React component
 */
export function overlayerShow(page) {
    return {
        type: OVERLAYER_SHOW,
        page
    }
}