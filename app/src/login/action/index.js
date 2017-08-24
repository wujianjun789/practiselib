import {AUTH} from '../../authentication/actionTypes'
import {login} from '../../util/network';
import {setAuth} from '../../authentication/auth'
import {getUserById} from "../../api/permission"
import {getAuth} from '../../authentication/auth'
export const loginHandler = (username, password,cbFail) => dispatch => {
    if(username.length <= 2 || password.length <= 4){
        cbFail && cbFail();
        return;
    }

    login({username:username, password:password}, response=>{
        getUserById(response.userId,res=>{
                response.role = res.role.name;
                setAuth(response);
                dispatch({ type: AUTH, auth: getAuth()});
              })
    }, err=>{
        cbFail && cbFail();
    })

}