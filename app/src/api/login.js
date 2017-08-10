/**
 * Created by a on 2017/7/26.
 */
import {login} from '../util/network';
import {setCookie} from '../util/cache'

export function loginHandler(username, password,cbSuccess,cbFail) {
    if(username.length <= 2 || password.length <= 4){
        cbFail && cbFail();
        return;
    }

    login({username:username, password:password}, response=>{
        setCookie("user", response)
        cbSuccess && cbSuccess();
    }, err=>{
        cbFail && cbFail();
    })

}