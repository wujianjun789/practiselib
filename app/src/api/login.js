/**
 * Created by a on 2017/7/26.
 */
import {login} from '../util/network';

export function loginHandler(username, password,cbSuccess,cbFail) {
    if(username.length <= 2 || password.length <= 4){
        cbFail && cbFail();
        return;
    }

    login({name:username, password:password}, response=>{
        cbSuccess && cbSuccess();
    }, err=>{
        cbFail && cbFail();
    })
    // cbSuccess && cbSuccess();

}