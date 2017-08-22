/**
 * Created by a on 2017/7/26.
 */

import {LOGED_IN} from '../authentication/actionTypes'
import {login} from '../util/network';
import {setAuth} from '../authentication/auth'
import {HOST_IP, getHttpHeader, httpRequest} from '../util/network';
import {getUserById} from "./permission"

export const loginHandler = (username, password,cbSuccess,cbFail) => dispatch => {
    if(username.length <= 2 || password.length <= 4){
        cbFail && cbFail();
        return;
    }

    login({username:username, password:password}, response=>{
        getUserById(response.userId,res=>{
                response.role = res.role.name;
                setAuth(response);
                dispatch({ type: LOGED_IN });
                cbSuccess && cbSuccess();
              })
    }, err=>{
        cbFail && cbFail();
    })

}