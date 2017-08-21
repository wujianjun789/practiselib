/**
 * Created by a on 2017/7/26.
 */
import {LOGED_IN} from '../authentication/actionTypes'
import {login} from '../util/network';
import {setAuth} from '../authentication/auth'
import {HOST_IP, getHttpHeader, httpRequest} from '../util/network'

export const loginHandler = (username, password,cbSuccess,cbFail) => dispatch => {
    if(username.length <= 2 || password.length <= 4){
        cbFail && cbFail();
        return;
    }

    login({username:username, password:password}, response=>{
        let headers = getHttpHeader();
        httpRequest(`${HOST_IP}/users/${response.userId}`, {
            method: 'GET',
            headers: headers,
          }, res=>{
            response.roleId = res.roleId;
            setAuth(response);
            dispatch({ type: LOGED_IN });
            cbSuccess && cbSuccess();
          })
        
    }, err=>{
        cbFail && cbFail();
    })

}