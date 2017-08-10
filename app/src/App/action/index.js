/**
 * Created by a on 2017/8/10.
 */
import {getHttpHeader, getModuleConfig} from '../../util/network'
import {
    MODULE_INIT
} from '../actionType/index'
export function getModule() {
    let headers = getHttpHeader();

    return dispatch=>{
       getModuleConfig(response=>{
            dispatch({type:MODULE_INIT, data:response})
       }, err=>{
           throw (err);
       })
    }
}